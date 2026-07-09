import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";
import { runLiveConsumptionTick } from "../../../shared/infrastructure/data/local-consumption-meter.service";
import { AnomalyAssembler } from "../assembler/anomaly.assembler";
import { ConsumptionReadingAssembler } from "../assembler/consumption-reading.assembler";
import { MonitoringSummaryAssembler } from "../assembler/monitoring-summary.assembler";
import { ThresholdAssembler } from "../assembler/threshold.assembler";

const anomalyAssembler = new AnomalyAssembler();
const readingAssembler = new ConsumptionReadingAssembler();
const summaryAssembler = new MonitoringSummaryAssembler();
const thresholdAssembler = new ThresholdAssembler();

function sumByResource(readings, resourceType) {
    return readings
        .filter((reading) => reading.resourceType === resourceType)
        .reduce((total, reading) => total + Number(reading.value || 0), 0);
}

function getResourceName(resourceType = "water") {
    const names = {
        water: "agua",
        gas: "gas",
    };

    return names[resourceType] || "recurso";
}

function getSeverityName(severity = "warning") {
    const names = {
        warning: "de advertencia",
        critical: "critico",
    };

    return names[severity] || "operativo";
}

function getLocationFocus(location = {}) {
    return (
        location.sensorName ||
        location.deviceGroupName ||
        location.roomName ||
        location.siteName ||
        ""
    );
}

function isTechnicalThresholdName(name = "") {
    return /threshold|critical|warning|kitchen|tower/i.test(name);
}

function buildThresholdName(threshold, context, severity) {
    const resourceName = getResourceName(threshold.resourceType);
    const severityName = getSeverityName(severity);
    const location = getLocationFocus(context.location);

    return location
        ? `Limite ${severityName} de ${resourceName} en ${location}`
        : `Limite ${severityName} de ${resourceName}`;
}

function normalizeThresholdName(threshold, context, severity) {
    const rawName = String(threshold.name || "").trim();

    if (rawName && !isTechnicalThresholdName(rawName)) {
        return rawName;
    }

    return buildThresholdName(threshold, context, severity);
}

function isTechnicalAnomalyDescription(description = "") {
    return /reading|exceeded|critical limit|warning limit|threshold/i.test(description);
}

function buildAnomalyDescription(anomaly, context) {
    const resourceName = getResourceName(anomaly.resourceType);
    const severityName = anomaly.severity === "critical" ? "critico" : "de advertencia";
    const location = getLocationFocus(context.location);
    const measuredValue = `${Number(anomaly.value || 0)} ${anomaly.unit || ""}`.trim();
    const limitValue = `${Number(anomaly.limitValue || 0)} ${anomaly.unit || ""}`.trim();
    const locationText = location ? ` en ${location}` : "";

    return `${resourceName.charAt(0).toUpperCase()}${resourceName.slice(1)} fuera de rango${locationText}: ${measuredValue} supero el limite ${severityName} de ${limitValue}.`;
}

function normalizeAnomalyDescription(anomaly, context) {
    const rawDescription = String(anomaly.description || "").trim();

    if (rawDescription && !isTechnicalAnomalyDescription(rawDescription)) {
        return rawDescription;
    }

    return buildAnomalyDescription(anomaly, context);
}

function buildCatalog({ sites = [], rooms = [], deviceGroups = [], devices = [], sensors = [] } = {}) {
    return {
        sites,
        rooms,
        deviceGroups,
        devices,
        sensors,
        siteById: new Map(sites.map((site) => [site.id, site])),
        roomById: new Map(rooms.map((room) => [room.id, room])),
        groupById: new Map(deviceGroups.map((group) => [group.id, group])),
        deviceById: new Map(devices.map((device) => [device.id, device])),
        sensorById: new Map(sensors.map((sensor) => [sensor.id, sensor])),
    };
}

function getLocalCatalog() {
    return buildCatalog({
        sites: LocalPlatformDataService.list("sites"),
        rooms: LocalPlatformDataService.list("rooms"),
        deviceGroups: LocalPlatformDataService.list("deviceGroups"),
        devices: LocalPlatformDataService.list("devices"),
        sensors: LocalPlatformDataService.list("sensors"),
    });
}

function resolvePhysicalContext(source = {}, catalog = getLocalCatalog()) {
    const sensor = catalog.sensorById.get(source.sensorId);
    const device = catalog.deviceById.get(source.deviceId || sensor?.deviceId);
    const deviceGroup = catalog.groupById.get(source.deviceGroupId || device?.deviceGroupId);
    const room = catalog.roomById.get(source.roomId || deviceGroup?.roomId || device?.roomId);
    const site = catalog.siteById.get(source.siteId || sensor?.siteId || device?.siteId || room?.siteId);

    return {
        siteId: source.siteId || site?.id || "",
        roomId: source.roomId || room?.id || "",
        deviceGroupId: source.deviceGroupId || deviceGroup?.id || "",
        deviceId: source.deviceId || device?.id || "",
        sensorId: source.sensorId || sensor?.id || "",
        location: {
            siteName: site?.name || "",
            roomName: room?.name || "",
            deviceGroupName: deviceGroup?.name || "",
            deviceName: device?.name || "",
            sensorName: sensor?.name || "",
        },
    };
}

function enrichReading(reading, catalog = getLocalCatalog()) {
    const context = resolvePhysicalContext(reading, catalog);

    return readingAssembler.toEntity({
        ...reading,
        ...context,
        capturedAt: reading.capturedAt || reading.recordedAt || reading.measuredAt,
    });
}

function enrichAnomaly(anomaly, catalog = getLocalCatalog()) {
    const reading = anomaly.readingId
        ? LocalPlatformDataService.getById("readings", anomaly.readingId) || {}
        : {};
    const context = resolvePhysicalContext({
        ...reading,
        ...anomaly,
    }, catalog);

    return anomalyAssembler.toEntity({
        ...reading,
        ...anomaly,
        ...context,
        description: normalizeAnomalyDescription(anomaly, context),
        detectedAt: anomaly.detectedAt || anomaly.createdAt,
    });
}

function normalizeThreshold(threshold, catalog = getLocalCatalog()) {
    const context = resolvePhysicalContext(threshold, catalog);
    const limitValue = threshold.limitValue ?? threshold.criticalLimit ?? threshold.warningLimit ?? 0;
    const severity = threshold.severity || (threshold.criticalLimit ? "critical" : "warning");

    return thresholdAssembler.toEntity({
        ...threshold,
        ...context,
        name: normalizeThresholdName(threshold, context, severity),
        operator: threshold.operator || "greater_or_equal",
        limitValue,
        severity,
        isActive: threshold.isActive ?? threshold.enabled ?? true,
    });
}

function thresholdMatchesReading(threshold, reading) {
    if (!threshold.isActive || threshold.resourceType !== reading.resourceType) return false;
    if (threshold.siteId && threshold.siteId !== reading.siteId) return false;
    if (threshold.roomId && threshold.roomId !== reading.roomId) return false;
    if (threshold.deviceGroupId && threshold.deviceGroupId !== reading.deviceGroupId) return false;
    if (threshold.sensorId && threshold.sensorId !== reading.sensorId) return false;

    return true;
}

function exceedsThreshold(reading, threshold) {
    const value = Number(reading.value || 0);
    const limitValue = Number(threshold.limitValue || 0);

    switch (threshold.operator) {
        case "greater_than":
            return value > limitValue;
        case "greater_or_equal":
            return value >= limitValue;
        case "less_than":
            return value < limitValue;
        case "less_or_equal":
            return value <= limitValue;
        default:
            return value >= limitValue;
    }
}

function buildLocalSummary() {
    runLiveConsumptionTick();

    const catalog = getLocalCatalog();
    const readings = LocalPlatformDataService.list("readings").map((reading) => enrichReading(reading, catalog));
    const anomalies = LocalPlatformDataService.list("anomalies").map((anomaly) => enrichAnomaly(anomaly, catalog));
    const thresholds = LocalPlatformDataService.list("thresholds").map((threshold) => normalizeThreshold(threshold, catalog));
    const activeSession = LocalPlatformDataService.list("monitoringSessions", { isActive: true })[0] || null;
    const latestReading = readings
        .slice()
        .sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt))[0];

    return summaryAssembler.toEntity({
        totalWater: sumByResource(readings, "water"),
        totalGas: sumByResource(readings, "gas"),
        totalReadings: readings.length,
        openAnomalies: anomalies.filter((anomaly) => anomaly.status === "open").length,
        criticalAnomalies: anomalies.filter(
            (anomaly) => anomaly.severity === "critical" && anomaly.status === "open"
        ).length,
        activeThresholds: thresholds.filter((threshold) => threshold.isActive).length,
        monitoredSensors: new Set(readings.map((reading) => reading.sensorId)).size,
        activeSessions: activeSession ? 1 : 0,
        latestReadingDate: latestReading?.capturedAt || null,
    });
}

function listLocalReadings(filters = {}) {
    runLiveConsumptionTick();

    const catalog = getLocalCatalog();
    const readings = LocalPlatformDataService.list("readings").map((reading) => enrichReading(reading, catalog));

    if (filters.resourceType && filters.resourceType !== "all") {
        return readings.filter((reading) => reading.resourceType === filters.resourceType);
    }

    return readings;
}

function listLocalThresholds() {
    const catalog = getLocalCatalog();
    return LocalPlatformDataService.list("thresholds").map((threshold) => normalizeThreshold(threshold, catalog));
}

function listLocalAnomalies() {
    const catalog = getLocalCatalog();
    return LocalPlatformDataService.list("anomalies")
        .map((anomaly) => enrichAnomaly(anomaly, catalog))
        .filter((anomaly) => anomaly.status === "open");
}

function createLocalReading(input) {
    const catalog = getLocalCatalog();
    const context = resolvePhysicalContext(input, catalog);
    const resourceType = input.resourceType || "water";
    const reading = enrichReading(
        LocalPlatformDataService.create("readings", {
            ...context,
            resourceType,
            value: Number(input.value || 0),
            unit: input.unit || (resourceType === "gas" ? "m3" : "L"),
            capturedAt: input.capturedAt || new Date().toISOString(),
            measuredAt: input.capturedAt || new Date().toISOString(),
            status: "normal",
        }),
        catalog
    );

    const thresholds = listLocalThresholds().filter((threshold) =>
        thresholdMatchesReading(threshold, reading)
    );
    const exceededThresholds = thresholds.filter((threshold) =>
        exceedsThreshold(reading, threshold)
    );

    const anomalies = exceededThresholds.map((threshold) =>
        enrichAnomaly(
            LocalPlatformDataService.create("anomalies", {
                readingId: reading.id,
                thresholdId: threshold.id,
                siteId: reading.siteId,
                roomId: reading.roomId,
                deviceGroupId: reading.deviceGroupId,
                deviceId: reading.deviceId,
                sensorId: reading.sensorId,
                resourceType: reading.resourceType,
                value: reading.value,
                limitValue: threshold.limitValue,
                unit: reading.unit,
                severity: threshold.severity,
                description: `${threshold.name}: ${reading.value} ${reading.unit}`,
                status: "open",
                detectedAt: new Date().toISOString(),
            }),
            catalog
        )
    );

    if (anomalies.some((anomaly) => anomaly.severity === "critical")) {
        LocalPlatformDataService.update("readings", reading.id, { status: "critical" });
        reading.status = "critical";
    } else if (anomalies.length) {
        LocalPlatformDataService.update("readings", reading.id, { status: "warning" });
        reading.status = "warning";
    }

    return {
        reading,
        anomalies,
        criticalEvents: anomalies.filter((anomaly) => anomaly.severity === "critical").length,
    };
}

function createLocalThreshold(input) {
    const catalog = getLocalCatalog();
    const context = resolvePhysicalContext(input, catalog);

    return normalizeThreshold(
        LocalPlatformDataService.create("thresholds", {
            ...context,
            name: input.name,
            resourceType: input.resourceType || "water",
            operator: input.operator || "greater_or_equal",
            limitValue: Number(input.limitValue || 0),
            unit: input.unit || (input.resourceType === "gas" ? "m3" : "L"),
            severity: input.severity || "warning",
            isActive: true,
            enabled: true,
        }),
        catalog
    );
}

function resolveLocalAnomaly(anomalyId) {
    return enrichAnomaly(
        LocalPlatformDataService.update("anomalies", anomalyId, { status: "resolved" }),
        getLocalCatalog()
    );
}

function toPhysicalOptions(catalog) {
    return {
        sites: catalog.sites,
        rooms: catalog.rooms,
        deviceGroups: catalog.deviceGroups,
        sensors: catalog.sensors.map((sensor) => ({
            ...sensor,
            ...resolvePhysicalContext(sensor, catalog),
        })),
    };
}

export class MonitoringApiService {
    async getSummary() {
        return buildLocalSummary();
    }

    async getSession() {
        const sessions = LocalPlatformDataService.list("monitoringSessions", { isActive: true });
        return sessions[0] || null;
    }

    async getReadings(filters = {}) {
        return listLocalReadings(filters);
    }

    async getActiveThresholds() {
        return listLocalThresholds().filter((threshold) => threshold.isActive);
    }

    async getAnomalies() {
        return listLocalAnomalies();
    }

    async registerReading(reading) {
        return createLocalReading(reading);
    }

    async createReading(reading) {
        const result = await this.registerReading(reading);
        return result.reading;
    }

    async createThreshold(threshold) {
        return createLocalThreshold(threshold);
    }

    async resolveAnomaly(anomalyId) {
        return resolveLocalAnomaly(anomalyId);
    }

    async getReports() {
        return LocalPlatformDataService.list("reports");
    }

    async createReport(reportRequest = {}) {
        runLiveConsumptionTick();

        const siteId = reportRequest.siteId || "";
        const resourceType = reportRequest.resourceType || "all";
        const startDate = reportRequest.startDate ? new Date(reportRequest.startDate) : null;
        const endDate = reportRequest.endDate ? new Date(reportRequest.endDate) : null;
        const readings = LocalPlatformDataService.list("readings");
        const siteReadings = readings.filter((reading) => {
            const capturedAt = new Date(reading.capturedAt || reading.recordedAt || reading.measuredAt || reading.createdAt);
            const matchesSite = !siteId || reading.siteId === siteId;
            const matchesResource = resourceType === "all" || reading.resourceType === resourceType;
            const matchesStart = !startDate || capturedAt >= startDate;
            const matchesEnd = !endDate || capturedAt <= endDate;

            return matchesSite && matchesResource && matchesStart && matchesEnd;
        });
        const readingIds = new Set(siteReadings.map((reading) => reading.id));
        const anomalies = LocalPlatformDataService.list("anomalies").filter((anomaly) => {
            const detectedAt = new Date(anomaly.detectedAt || anomaly.createdAt || anomaly.updatedAt);
            const matchesSite = !siteId || anomaly.siteId === siteId;
            const matchesResource = resourceType === "all" || anomaly.resourceType === resourceType;
            const matchesReading = !anomaly.readingId || readingIds.has(anomaly.readingId);
            const matchesStart = !startDate || detectedAt >= startDate;
            const matchesEnd = !endDate || detectedAt <= endDate;

            return matchesSite && matchesResource && matchesReading && matchesStart && matchesEnd;
        });

        return LocalPlatformDataService.create("reports", {
            title: reportRequest.title || "Reporte de consumo",
            siteId,
            period: reportRequest.period || "custom",
            startDate: reportRequest.startDate || null,
            endDate: reportRequest.endDate || null,
            resourceType,
            totalWater: sumByResource(siteReadings, "water"),
            totalGas: sumByResource(siteReadings, "gas"),
            readingsCount: siteReadings.length,
            anomaliesCount: anomalies.length,
            status: "ready",
        });
    }

    async getPhysicalOptions() {
        return toPhysicalOptions(getLocalCatalog());
    }
}
