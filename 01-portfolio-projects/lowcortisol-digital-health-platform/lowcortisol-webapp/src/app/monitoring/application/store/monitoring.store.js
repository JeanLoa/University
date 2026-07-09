import { reactive, readonly } from "vue";
import { MonitoringFacade } from "../services/monitoring.facade";

const monitoringFacade = new MonitoringFacade();

const state = reactive({
    session: null,
    readings: [],
    thresholds: [],
    anomalies: [],
    reports: [],
    physicalOptions: {
        sites: [],
        rooms: [],
        deviceGroups: [],
        sensors: [],
    },
    summary: null,
    selectedResourceType: "all",
    loading: false,
    saving: false,
    error: null,
});

function isOpenAnomaly(anomaly) {
    return anomaly?.status !== "resolved" && anomaly?.status !== "closed";
}

function buildOperationalSummary(summary, readings = [], anomalies = [], thresholds = []) {
    const openAnomalies = anomalies.filter(isOpenAnomaly);
    const criticalAnomalies = openAnomalies.filter((anomaly) => anomaly.severity === "critical");
    const activeThresholds = thresholds.filter((threshold) => threshold.isActive !== false);

    return {
        ...summary,
        totalReadings: Math.max(Number(summary?.totalReadings || 0), readings.length),
        openAnomalies: Math.max(Number(summary?.openAnomalies || 0), openAnomalies.length),
        criticalAnomalies: Math.max(Number(summary?.criticalAnomalies || 0), criticalAnomalies.length),
        activeThresholds: Math.max(Number(summary?.activeThresholds || 0), activeThresholds.length),
    };
}

async function loadRecentReadings() {
    state.readings = await monitoringFacade.getRecentReadings({
        resourceType: state.selectedResourceType,
    });
}

async function loadActiveThresholds() {
    state.thresholds = await monitoringFacade.getActiveThresholds();
}

async function loadOpenAnomalies() {
    state.anomalies = await monitoringFacade.getOpenAnomalies();
}

async function loadMonitoringDashboard(options = {}) {
    const silent = Boolean(options.silent);

    if (!silent) {
        state.loading = true;
    }
    state.error = null;

    try {
        const [
            session,
            readings,
            thresholds,
            anomalies,
            reports,
            summary,
            physicalOptions,
        ] = await Promise.all([
            monitoringFacade.getSession(),
            monitoringFacade.getRecentReadings({ resourceType: state.selectedResourceType }),
            monitoringFacade.getActiveThresholds(),
            monitoringFacade.getOpenAnomalies(),
            monitoringFacade.getReports(),
            monitoringFacade.getSummary(),
            monitoringFacade.getPhysicalOptions(),
        ]);

        state.session = session;
        state.readings = readings;
        state.thresholds = thresholds;
        state.anomalies = anomalies;
        state.reports = reports;
        state.summary = buildOperationalSummary(summary, readings, anomalies, thresholds);
        state.physicalOptions = physicalOptions;
    } catch (error) {
        state.error = error.message || "monitoring.messages.loadError";
    } finally {
        if (!silent) {
            state.loading = false;
        }
    }
}

async function loadDashboard() {
    await loadMonitoringDashboard();
}

async function refreshMonitoringDashboard() {
    await loadMonitoringDashboard({ silent: true });
}

async function filterReadingsByResource(resourceType) {
    state.selectedResourceType = resourceType;
    await loadRecentReadings();
}

async function registerReading(payload) {
    state.saving = true;
    state.error = null;

    try {
        const result = await monitoringFacade.registerReading(payload);
        await loadMonitoringDashboard();
        return result;
    } catch (error) {
        state.error = error.message || "monitoring.messages.saveError";
        throw error;
    } finally {
        state.saving = false;
    }
}

async function createThreshold(payload) {
    state.saving = true;
    state.error = null;

    try {
        const threshold = await monitoringFacade.createThreshold(payload);
        await loadMonitoringDashboard();
        return threshold;
    } catch (error) {
        state.error = error.message || "monitoring.messages.saveError";
        throw error;
    } finally {
        state.saving = false;
    }
}

async function resolveAnomaly(anomalyId) {
    state.saving = true;
    state.error = null;

    try {
        const anomaly = await monitoringFacade.resolveAnomaly(anomalyId);
        await loadMonitoringDashboard();
        return anomaly;
    } catch (error) {
        state.error = error.message || "monitoring.messages.saveError";
        throw error;
    } finally {
        state.saving = false;
    }
}

async function createRandomReading() {
    const sensor = state.physicalOptions.sensors[0];
    if (!sensor) return null;

    return registerReading({
        siteId: sensor.siteId,
        roomId: sensor.roomId,
        deviceGroupId: sensor.deviceGroupId,
        deviceId: sensor.deviceId,
        sensorId: sensor.id,
        resourceType: sensor.resourceType || "water",
        value: Number(sensor.currentValue || 0),
        unit: sensor.unit || (sensor.resourceType === "gas" ? "m3" : "L"),
    });
}

async function createReport(payload = {}) {
    const reportRequest = typeof payload === "string"
        ? { siteId: payload }
        : payload;
    const report = await monitoringFacade.createReport({
        period: "custom",
        ...reportRequest,
    });

    await loadMonitoringDashboard();

    return report;
}

export function useMonitoringStore() {
    return {
        state: readonly(state),
        loadDashboard,
        loadMonitoringDashboard,
        refreshMonitoringDashboard,
        loadRecentReadings,
        loadActiveThresholds,
        loadOpenAnomalies,
        filterReadingsByResource,
        registerReading,
        createThreshold,
        resolveAnomaly,
        createRandomReading,
        createReport,
    };
}
