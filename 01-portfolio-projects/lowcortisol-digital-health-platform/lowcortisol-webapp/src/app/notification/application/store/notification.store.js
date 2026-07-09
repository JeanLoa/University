import { reactive, readonly } from "vue";
import { NotificationFacade } from "../services/notification.facade";

const notificationFacade = new NotificationFacade();

const defaultSummary = {
    totalAlerts: 0,
    openAlerts: 0,
    criticalAlerts: 0,
    acknowledgedAlerts: 0,
    resolvedAlerts: 0,
    openIncidents: 0,
    resolvedIncidents: 0,
    activeChannels: 0,
    channelsEnabled: 0,
    pendingDeliveries: 0,
    deliveriesSent: 0,
};
const activeAlertStatuses = ["open", "acknowledged"];

const state = reactive({
    alerts: [],
    openAlerts: [],
    criticalAlerts: [],
    incidents: [],
    openIncidents: [],
    channels: [],
    activeChannels: [],
    deliveries: [],
    summary: { ...defaultSummary },
    loading: false,
    saving: false,
    mitigationLoading: false,
    mitigationError: null,
    lastMitigation: null,
    error: null,
    message: "",
    selectedAlertId: null,
    selectedIncidentId: null,
    usingFallback: false,
});

function mergeAlerts(openAlerts = [], criticalAlerts = []) {
    const alertsById = new Map();

    [...criticalAlerts, ...openAlerts].forEach((alert) => {
        if (!activeAlertStatuses.includes(alert.status)) return;
        alertsById.set(alert.id, alert);
    });

    return Array.from(alertsById.values());
}

function updateFallbackFlag() {
    state.usingFallback = notificationFacade.isUsingFallback();
}

async function refreshAfterMutation(messageKey) {
    await loadNotificationCenter();
    state.message = messageKey;
}

async function runMutation(action, messageKey) {
    state.saving = true;
    state.error = null;

    try {
        const result = await action();
        await refreshAfterMutation(messageKey);
        updateFallbackFlag();

        return result;
    } catch (_error) {
        state.error = "notifications.errors.saveFailed";
        throw _error;
    } finally {
        state.saving = false;
    }
}

async function loadNotificationCenter() {
    state.loading = true;
    state.error = null;

    try {
        const [
            summary,
            openAlerts,
            criticalAlerts,
            openIncidents,
            channels,
            activeChannels,
            deliveries,
        ] = await Promise.all([
            notificationFacade.getSummary(),
            notificationFacade.getOpenAlerts(),
            notificationFacade.getCriticalAlerts(),
            notificationFacade.getOpenIncidents(),
            notificationFacade.getChannels(),
            notificationFacade.getActiveChannels(),
            notificationFacade.getDeliveries(),
        ]);

        state.summary = {
            ...defaultSummary,
            ...summary,
            channelsEnabled: summary.channelsEnabled ?? summary.activeChannels ?? 0,
        };
        state.openAlerts = openAlerts;
        state.criticalAlerts = criticalAlerts;
        state.alerts = mergeAlerts(openAlerts, criticalAlerts);
        state.openIncidents = openIncidents;
        state.incidents = openIncidents;
        state.channels = channels;
        state.activeChannels = activeChannels;
        state.deliveries = deliveries;
        updateFallbackFlag();
    } catch (_error) {
        state.error = "notifications.errors.loadFailed";
    } finally {
        state.loading = false;
    }
}

async function loadOpenAlerts() {
    state.openAlerts = await notificationFacade.getOpenAlerts();
    state.alerts = mergeAlerts(state.openAlerts, state.criticalAlerts);
    updateFallbackFlag();
}

async function loadCriticalAlerts() {
    state.criticalAlerts = await notificationFacade.getCriticalAlerts();
    state.alerts = mergeAlerts(state.openAlerts, state.criticalAlerts);
    updateFallbackFlag();
}

async function loadOpenIncidents() {
    state.openIncidents = await notificationFacade.getOpenIncidents();
    state.incidents = state.openIncidents;
    updateFallbackFlag();
}

async function loadNotificationChannels() {
    const [channels, activeChannels] = await Promise.all([
        notificationFacade.getChannels(),
        notificationFacade.getActiveChannels(),
    ]);

    state.channels = channels;
    state.activeChannels = activeChannels;
    updateFallbackFlag();
}

async function acknowledgeAlert(alertId, payload = {}) {
    state.selectedAlertId = alertId;

    return runMutation(
        () => notificationFacade.acknowledgeAlert(alertId, payload),
        "notifications.messages.alertAcknowledged"
    );
}

async function resolveAlert(alertId, payload = {}) {
    state.selectedAlertId = alertId;

    return runMutation(
        () => notificationFacade.resolveAlert(alertId, payload),
        "notifications.messages.alertResolved"
    );
}

async function closeAlert(alertId, payload = {}) {
    state.selectedAlertId = alertId;

    return runMutation(
        () => notificationFacade.closeAlert(alertId, payload),
        "notifications.messages.alertClosed"
    );
}

async function createIncidentFromAlert(alertId) {
    state.selectedAlertId = alertId;
    const alertSnapshot = state.alerts.find((alert) => alert.id === alertId) || null;

    return runMutation(
        () => notificationFacade.createIncidentFromAlert(alertId, alertSnapshot),
        "notifications.messages.incidentCreated"
    );
}

async function assignIncident(incidentId, payload = {}) {
    state.selectedIncidentId = incidentId;

    return runMutation(
        () => notificationFacade.assignIncident(incidentId, payload),
        "notifications.messages.incidentAssigned"
    );
}

async function registerIncidentAction(incidentId, payload = {}) {
    state.selectedIncidentId = incidentId;

    return runMutation(
        () => notificationFacade.registerIncidentAction(incidentId, payload),
        "notifications.messages.incidentActionRegistered"
    );
}

async function getIncidentActions(incidentId) {
    return notificationFacade.getIncidentActions(incidentId);
}

async function requestIncidentMitigation(incidentId, payload = {}) {
    state.selectedIncidentId = incidentId;
    state.mitigationLoading = true;
    state.mitigationError = null;

    try {
        const result = await notificationFacade.requestIncidentMitigation(incidentId, payload);
        state.lastMitigation = result?.mitigation || null;
        await refreshAfterMutation("notifications.messages.mitigationCompleted");
        updateFallbackFlag();

        return result;
    } catch (_error) {
        state.mitigationError = "notifications.errors.mitigationFailed";
        state.error = "notifications.errors.mitigationFailed";
        throw _error;
    } finally {
        state.mitigationLoading = false;
    }
}

async function resolveIncident(incidentId, payload = {}) {
    state.selectedIncidentId = incidentId;

    return runMutation(
        () => notificationFacade.resolveIncident(incidentId, payload),
        "notifications.messages.incidentResolved"
    );
}

async function closeIncident(incidentId, payload = {}) {
    state.selectedIncidentId = incidentId;

    return runMutation(
        () => notificationFacade.closeIncident(incidentId, payload),
        "notifications.messages.incidentClosed"
    );
}

async function createChannel(payload = {}) {
    return runMutation(
        () => notificationFacade.createChannel(payload),
        "notifications.messages.channelCreated"
    );
}

async function activateChannel(channelId) {
    return runMutation(
        () => notificationFacade.activateChannel(channelId),
        "notifications.messages.channelActivated"
    );
}

async function deactivateChannel(channelId) {
    return runMutation(
        () => notificationFacade.deactivateChannel(channelId),
        "notifications.messages.channelDeactivated"
    );
}

async function sendAlert(alertId) {
    state.selectedAlertId = alertId;

    return runMutation(
        () => notificationFacade.sendAlert(alertId),
        "notifications.messages.deliveryRegistered"
    );
}

function clearMessage() {
    state.message = "";
}

export function useNotificationStore() {
    return {
        state: readonly(state),
        loadNotificationCenter,
        loadOpenAlerts,
        loadCriticalAlerts,
        loadOpenIncidents,
        loadNotificationChannels,
        acknowledgeAlert,
        resolveAlert,
        closeAlert,
        createIncidentFromAlert,
        assignIncident,
        registerIncidentAction,
        getIncidentActions,
        requestIncidentMitigation,
        resolveIncident,
        closeIncident,
        createChannel,
        activateChannel,
        deactivateChannel,
        sendAlert,
        clearMessage,
    };
}
