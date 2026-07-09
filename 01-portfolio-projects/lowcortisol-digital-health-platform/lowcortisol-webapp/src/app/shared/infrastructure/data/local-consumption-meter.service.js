import { LocalPlatformDataService } from "./local-platform-data.service";

const conduitFlowProfiles = {
    cano: { resourceType: "water", flowPerMinute: 8 },
    manguera: { resourceType: "water", flowPerMinute: 14 },
    regadera: { resourceType: "water", flowPerMinute: 9 },
    ducha: { resourceType: "water", flowPerMinute: 10 },
    lavamanos: { resourceType: "water", flowPerMinute: 5 },
    lavadero: { resourceType: "water", flowPerMinute: 7 },
    inodoro: { resourceType: "water", flowPerMinute: 6 },
    riego: { resourceType: "water", flowPerMinute: 18 },
    tuberia_agua: { resourceType: "water", flowPerMinute: 20 },
    tuberia_gas: { resourceType: "gas", flowPerMinute: 1.6 },
    cocina_gas: { resourceType: "gas", flowPerMinute: 0.8 },
    calentador_gas: { resourceType: "gas", flowPerMinute: 1.1 },
    quemador: { resourceType: "gas", flowPerMinute: 1.3 },
    linea_gas: { resourceType: "gas", flowPerMinute: 2.2 },
};

function toDate(value, fallback = new Date()) {
    const date = value ? new Date(value) : fallback;
    return Number.isNaN(date.getTime()) ? fallback : date;
}

function getResourceUnit(resourceType = "water") {
    return resourceType === "gas" ? "m3" : "L";
}

function getValveSensor(valve) {
    if (!valve) return null;

    return (
        (valve.sensorId && LocalPlatformDataService.getById("sensors", valve.sensorId)) ||
        LocalPlatformDataService
            .list("sensors")
            .find(
                (sensor) =>
                    sensor.deviceId === valve.deviceId &&
                    sensor.resourceType === valve.resourceType
            ) ||
        null
    );
}

function getConduitValve(conduit) {
    if (!conduit?.valveId) return null;

    return LocalPlatformDataService.getById("valves", conduit.valveId);
}

function getConduitSensor(conduit, valve) {
    if (conduit?.sensorId) {
        return LocalPlatformDataService.getById("sensors", conduit.sensorId);
    }

    return getValveSensor(valve);
}

function getOpeningFactor(openingPercentage = 0) {
    const opening = Math.max(0, Math.min(100, Number(openingPercentage || 0)));
    if (opening <= 0) return 0;

    return Math.pow(opening / 100, 1.15);
}

function getFlowProfile(conduit, valve) {
    const resourceType = conduit?.resourceType || valve?.resourceType || "water";
    const customFlow = Number(conduit?.flowRatePerMinute || 0);

    if (customFlow > 0) {
        return {
            resourceType,
            flowPerMinute: customFlow,
        };
    }

    return conduitFlowProfiles[conduit?.conduitType] || {
        resourceType,
        flowPerMinute: resourceType === "gas" ? 1 : 8,
    };
}

function roundConsumption(resourceType, value) {
    const precision = resourceType === "gas" ? 3 : 2;
    const multiplier = 10 ** precision;

    return Math.round(Number(value || 0) * multiplier) / multiplier;
}

function thresholdMatchesReading(threshold, reading) {
    const isActive = threshold.isActive ?? threshold.enabled ?? true;
    if (!isActive || threshold.resourceType !== reading.resourceType) return false;
    if (threshold.siteId && threshold.siteId !== reading.siteId) return false;
    if (threshold.roomId && threshold.roomId !== reading.roomId) return false;
    if (threshold.deviceGroupId && threshold.deviceGroupId !== reading.deviceGroupId) return false;
    if (threshold.deviceId && threshold.deviceId !== reading.deviceId) return false;
    if (threshold.sensorId && threshold.sensorId !== reading.sensorId) return false;

    return true;
}

function getThresholdLimit(threshold) {
    return Number(threshold.limitValue ?? threshold.criticalLimit ?? threshold.warningLimit ?? 0);
}

function exceedsThreshold(reading, threshold) {
    const value = Number(reading.value || 0);
    const limitValue = getThresholdLimit(threshold);

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

function evaluateReadingRisk(reading) {
    const exceededThresholds = LocalPlatformDataService
        .list("thresholds")
        .filter((threshold) => thresholdMatchesReading(threshold, reading))
        .filter((threshold) => exceedsThreshold(reading, threshold));

    if (!exceededThresholds.length) return "normal";

    const anomalies = exceededThresholds.map((threshold) => {
        const severity = threshold.severity || (threshold.criticalLimit ? "critical" : "warning");
        const limitValue = getThresholdLimit(threshold);

        return LocalPlatformDataService.create("anomalies", {
            readingId: reading.id,
            thresholdId: threshold.id,
            siteId: reading.siteId,
            roomId: reading.roomId,
            deviceGroupId: reading.deviceGroupId,
            deviceId: reading.deviceId,
            sensorId: reading.sensorId,
            resourceType: reading.resourceType,
            value: reading.value,
            limitValue,
            unit: reading.unit,
            severity,
            description: `${reading.value} ${reading.unit} supero el limite de ${limitValue} ${reading.unit}.`,
            status: "open",
            detectedAt: reading.capturedAt || new Date().toISOString(),
        });
    });

    return anomalies.some((anomaly) => anomaly.severity === "critical")
        ? "critical"
        : "warning";
}

function updateSiteConsumption(siteId, resourceType, value) {
    const site = LocalPlatformDataService.getById("sites", siteId);
    if (!site) return;

    const consumptionKey = resourceType === "gas" ? "gasConsumption" : "waterConsumption";

    LocalPlatformDataService.update("sites", siteId, {
        [consumptionKey]: roundConsumption(
            resourceType,
            Number(site[consumptionKey] || 0) + Number(value || 0)
        ),
    });
}

export function estimateConduitFlowPerMinute(conduit, valve) {
    const profile = getFlowProfile(conduit, valve);
    const openingFactor = getOpeningFactor(valve?.openingPercentage);

    return roundConsumption(
        profile.resourceType,
        Number(profile.flowPerMinute || 0) * openingFactor
    );
}

export function estimateConduitConsumptionForElapsed(conduit, valve, elapsedSeconds) {
    const resourceType = conduit?.resourceType || valve?.resourceType || "water";
    const flowPerMinute = estimateConduitFlowPerMinute(conduit, valve);

    return roundConsumption(resourceType, flowPerMinute * (elapsedSeconds / 60));
}

export function runLiveConsumptionTick({
    minimumElapsedSeconds = 1,
    maximumElapsedSeconds = 5,
    capturedAt = new Date(),
} = {}) {
    const nowDate = toDate(capturedAt);
    const capturedAtIso = nowDate.toISOString();
    const readings = [];

    LocalPlatformDataService
        .list("devices")
        .filter((device) => device.type === "conduit" && device.flowStatus === "active")
        .forEach((conduit) => {
            const valve = getConduitValve(conduit);
            const sensor = getConduitSensor(conduit, valve);
            const site = LocalPlatformDataService.getById("sites", conduit.siteId || valve?.siteId);

            if (
                !valve ||
                !sensor ||
                site?.status === "inactive" ||
                sensor.status !== "active" ||
                valve.status !== "open" ||
                Number(valve.openingPercentage || 0) <= 0
            ) {
                return;
            }

            const lastMeteredAt = toDate(
                conduit.lastMeteredAt || conduit.lastActivatedAt,
                nowDate
            );
            const rawElapsedSeconds = (nowDate.getTime() - lastMeteredAt.getTime()) / 1000;

            if (rawElapsedSeconds < minimumElapsedSeconds) return;

            const elapsedSeconds = Math.min(maximumElapsedSeconds, Math.max(0, rawElapsedSeconds));
            const resourceType = conduit.resourceType || valve.resourceType || sensor.resourceType || "water";
            const unit = sensor.unit || getResourceUnit(resourceType);
            const flowPerMinute = estimateConduitFlowPerMinute(conduit, valve);
            const value = estimateConduitConsumptionForElapsed(conduit, valve, elapsedSeconds);

            if (value <= 0) {
                LocalPlatformDataService.update("devices", conduit.id, {
                    lastMeteredAt: capturedAtIso,
                    lastFlowRate: flowPerMinute,
                    lastSyncAt: capturedAtIso,
                });
                return;
            }

            const updatedSensor = LocalPlatformDataService.update("sensors", sensor.id, {
                currentValue: value,
                flowRatePerMinute: flowPerMinute,
                unit,
                hasExceededThreshold: false,
            });

            const reading = LocalPlatformDataService.create("readings", {
                siteId: conduit.siteId || valve.siteId || sensor.siteId || "",
                roomId: conduit.roomId || valve.roomId || sensor.roomId || "",
                deviceGroupId: conduit.deviceGroupId || valve.deviceGroupId || sensor.deviceGroupId || "",
                deviceId: conduit.id,
                sensorId: updatedSensor.id,
                resourceType,
                value,
                unit,
                flowRatePerMinute: flowPerMinute,
                intervalSeconds: elapsedSeconds,
                status: "normal",
                capturedAt: capturedAtIso,
                measuredAt: capturedAtIso,
            });
            const readingStatus = evaluateReadingRisk(reading);

            if (readingStatus !== "normal") {
                LocalPlatformDataService.update("readings", reading.id, {
                    status: readingStatus,
                });
                reading.status = readingStatus;
            }

            updateSiteConsumption(reading.siteId, resourceType, value);

            LocalPlatformDataService.update("devices", conduit.id, {
                status: "online",
                flowStatus: "active",
                lastConsumptionValue: value,
                lastFlowRate: flowPerMinute,
                totalConsumption: roundConsumption(
                    resourceType,
                    Number(conduit.totalConsumption || 0) + value
                ),
                lastMeteredAt: capturedAtIso,
                lastSyncAt: capturedAtIso,
            });

            readings.push(reading);
        });

    return {
        capturedAt: capturedAtIso,
        readings,
    };
}
