import { ApiClientService } from "../../../shared/infrastructure/http/api-client.service";
import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";
import { AlertAssembler } from "../assembler/alert.assembler";
import { AlertDeliveryAssembler } from "../assembler/alert-delivery.assembler";
import { IncidentActionAssembler } from "../assembler/incident-action.assembler";
import { IncidentAssembler } from "../assembler/incident.assembler";
import { NotificationChannelAssembler } from "../assembler/notification-channel.assembler";

const alertAssembler = new AlertAssembler();
const deliveryAssembler = new AlertDeliveryAssembler();
const incidentActionAssembler = new IncidentActionAssembler();
const incidentAssembler = new IncidentAssembler();
const channelAssembler = new NotificationChannelAssembler();

const OPEN_ALERT_STATUSES = ["open", "acknowledged"];
const OPEN_INCIDENT_STATUSES = ["open", "assigned", "in_progress"];

function mergeById(primary = [], secondary = []) {
    return Array.from(
        new Map(
            [...primary, ...secondary]
                .filter((item) => item?.id)
                .map((item) => [item.id, item])
        ).values()
    );
}

function normalizeSummary(summary = {}) {
    const activeChannels = summary.activeChannels ?? summary.channelsEnabled ?? 0;
    const pendingDeliveries = summary.pendingDeliveries ?? 0;

    return {
        totalAlerts: summary.totalAlerts ?? 0,
        openAlerts: summary.openAlerts ?? 0,
        criticalAlerts: summary.criticalAlerts ?? 0,
        acknowledgedAlerts: summary.acknowledgedAlerts ?? 0,
        resolvedAlerts: summary.resolvedAlerts ?? 0,
        openIncidents: summary.openIncidents ?? 0,
        resolvedIncidents: summary.resolvedIncidents ?? 0,
        activeChannels,
        channelsEnabled: activeChannels,
        pendingDeliveries,
        deliveriesSent: summary.deliveriesSent ?? 0,
    };
}

function listLocalAlerts() {
    return LocalPlatformDataService.list("alerts").map((alert) => {
        const deliveries = LocalPlatformDataService
            .list("alertDeliveries", { alertId: alert.id });

        return alertAssembler.toEntity({
            ...alert,
            sourceType: alert.sourceType || "threshold",
            deliveries,
        });
    });
}

function listLocalIncidents() {
    return LocalPlatformDataService.list("incidents").map((incident) => {
        const actions = LocalPlatformDataService.list("incidentActions", { incidentId: incident.id });
        const assignments = LocalPlatformDataService.list("incidentAssignments", { incidentId: incident.id });

        return incidentAssembler.toEntity({
            ...incident,
            actions,
            assignments,
        });
    });
}

function listLocalChannels() {
    return LocalPlatformDataService
        .list("notificationChannels")
        .map((channel) => channelAssembler.toEntity(channel));
}

function listLocalDeliveries() {
    return LocalPlatformDataService
        .list("alertDeliveries")
        .map((delivery) => deliveryAssembler.toEntity(delivery));
}

function buildLocalSummary() {
    const alerts = listLocalAlerts();
    const incidents = listLocalIncidents();
    const channels = listLocalChannels();
    const deliveries = listLocalDeliveries();

    return normalizeSummary({
        totalAlerts: alerts.length,
        openAlerts: alerts.filter((alert) => OPEN_ALERT_STATUSES.includes(alert.status)).length,
        criticalAlerts: alerts.filter(
            (alert) => alert.severity === "critical" && OPEN_ALERT_STATUSES.includes(alert.status)
        ).length,
        acknowledgedAlerts: alerts.filter((alert) => alert.status === "acknowledged").length,
        resolvedAlerts: alerts.filter((alert) => alert.status === "resolved").length,
        openIncidents: incidents.filter((incident) => OPEN_INCIDENT_STATUSES.includes(incident.status)).length,
        resolvedIncidents: incidents.filter((incident) => incident.status === "resolved").length,
        activeChannels: channels.filter((channel) => channel.isActive).length,
        pendingDeliveries: deliveries.filter((delivery) => delivery.status === "pending").length,
        deliveriesSent: deliveries.filter((delivery) => delivery.status === "sent").length,
    });
}

function mapAlertSeverityToPriority(severity) {
    const priorities = {
        info: "low",
        warning: "medium",
        critical: "critical",
    };

    return priorities[severity] || "medium";
}

function getOperatorName(value, fallback = "Operations") {
    return value || fallback;
}

function createLocalDeliveryForAlert(alert, channel) {
    return LocalPlatformDataService.create("alertDeliveries", {
        alertId: alert.id,
        channelId: channel.id,
        channelType: channel.type,
        status: channel.isActive ? "sent" : "skipped",
        recipientUserId: "USR-001",
        recipientEmail: "demo@lowcortisol.com",
        recipientDisplayName: "LowCortisol Operations",
        messageTitle: alert.title,
        messageDescription: alert.description,
        attemptedAt: new Date().toISOString(),
        sentAt: channel.isActive ? new Date().toISOString() : null,
        failureReason: "",
    });
}

function acknowledgeLocalAlert(alertId, payload = {}) {
    return alertAssembler.toEntity(
        LocalPlatformDataService.update("alerts", alertId, {
            status: "acknowledged",
            acknowledgedAt: new Date().toISOString(),
            acknowledgedBy: getOperatorName(payload.acknowledgedBy),
        })
    );
}

function resolveLocalAlert(alertId, payload = {}) {
    return alertAssembler.toEntity(
        LocalPlatformDataService.update("alerts", alertId, {
            status: "resolved",
            resolvedAt: new Date().toISOString(),
            resolvedBy: getOperatorName(payload.resolvedBy),
            resolutionNote: payload.note || "",
        })
    );
}

function closeLocalAlert(alertId, payload = {}) {
    return alertAssembler.toEntity(
        LocalPlatformDataService.update("alerts", alertId, {
            status: "closed",
            closedAt: new Date().toISOString(),
            closedBy: getOperatorName(payload.closedBy),
            closingNote: payload.note || "",
        })
    );
}

function createLocalIncidentFromAlert(alertId, alertSnapshot = null) {
    const alert = LocalPlatformDataService.getById("alerts", alertId) || alertSnapshot;

    if (!alert) {
        throw new Error("No se encontro la alerta seleccionada.");
    }

    const existingIncident = LocalPlatformDataService
        .list("incidents", { alertId })
        .find((incident) => incident.status !== "closed");

    if (existingIncident) {
        return incidentAssembler.toEntity({
            ...existingIncident,
            actions: LocalPlatformDataService.list("incidentActions", { incidentId: existingIncident.id }),
            assignments: LocalPlatformDataService.list("incidentAssignments", { incidentId: existingIncident.id }),
        });
    }

    const incident = LocalPlatformDataService.create("incidents", {
        alertId: alert.id,
        siteId: alert.siteId,
        roomId: alert.roomId || "",
        deviceGroupId: alert.deviceGroupId || "",
        deviceId: alert.deviceId || "",
        sensorId: alert.sensorId || "",
        priority: mapAlertSeverityToPriority(alert.severity),
        status: "open",
        title: alert.title,
        description: alert.description,
        resolvedAt: null,
        closedAt: null,
    });

    if (alert.status === "open" && LocalPlatformDataService.getById("alerts", alert.id)) {
        LocalPlatformDataService.update("alerts", alert.id, {
            status: "acknowledged",
            acknowledgedAt: new Date().toISOString(),
        });
    }

    return incidentAssembler.toEntity({
        ...incident,
        actions: [],
        assignments: [],
    });
}

function assignLocalIncident(incidentId, payload = {}) {
    LocalPlatformDataService
        .list("incidentAssignments", { incidentId })
        .filter((assignment) => assignment.isActive)
        .forEach((assignment) =>
            LocalPlatformDataService.update("incidentAssignments", assignment.id, { isActive: false })
        );

    const assignment = LocalPlatformDataService.create("incidentAssignments", {
        incidentId,
        assigneeId: payload.assigneeId || payload.assigneeName || "operator",
        assigneeName: payload.assigneeName || payload.assigneeId || "Operations",
        assignedAt: new Date().toISOString(),
        isActive: true,
    });

    const incident = LocalPlatformDataService.update("incidents", incidentId, {
        status: "assigned",
        assignedTo: assignment.assigneeName,
    });

    return incidentAssembler.toEntity({
        ...incident,
        actions: LocalPlatformDataService.list("incidentActions", { incidentId }),
        assignments: LocalPlatformDataService.list("incidentAssignments", { incidentId }),
    });
}

function registerLocalIncidentAction(incidentId, payload = {}) {
    LocalPlatformDataService.create("incidentActions", {
        incidentId,
        actionType: payload.actionType || "operator_note",
        description: payload.description || "",
        performedBy: payload.performedBy || "Operations",
        performedAt: new Date().toISOString(),
    });

    const incident = LocalPlatformDataService.update("incidents", incidentId, {
        status: "in_progress",
    });

    return incidentAssembler.toEntity({
        ...incident,
        actions: LocalPlatformDataService.list("incidentActions", { incidentId }),
        assignments: LocalPlatformDataService.list("incidentAssignments", { incidentId }),
    });
}

function resolveLocalIncident(incidentId, payload = {}) {
    const incident = LocalPlatformDataService.update("incidents", incidentId, {
        status: "resolved",
        resolvedAt: new Date().toISOString(),
        resolvedBy: getOperatorName(payload.resolvedBy),
        resolution: payload.resolution || "",
    });

    return incidentAssembler.toEntity({
        ...incident,
        actions: LocalPlatformDataService.list("incidentActions", { incidentId }),
        assignments: LocalPlatformDataService.list("incidentAssignments", { incidentId }),
    });
}

function closeLocalIncident(incidentId, payload = {}) {
    const incident = LocalPlatformDataService.update("incidents", incidentId, {
        status: "closed",
        closedAt: new Date().toISOString(),
        closedBy: getOperatorName(payload.closedBy),
        closingNote: payload.closingNote || "",
    });

    return incidentAssembler.toEntity({
        ...incident,
        actions: LocalPlatformDataService.list("incidentActions", { incidentId }),
        assignments: LocalPlatformDataService.list("incidentAssignments", { incidentId }),
    });
}

function findLocalValveForIncident(incident, payload = {}) {
    const valves = LocalPlatformDataService.list("valves");

    if (payload.valveId) {
        const selectedValve = valves.find((valve) => valve.id === payload.valveId);
        if (selectedValve) return selectedValve;
    }

    return (
        valves.find(
            (valve) =>
                valve.deviceId === incident.deviceId &&
                valve.status === "open"
        ) ||
        valves.find((valve) => valve.deviceId === incident.deviceId) ||
        valves.find(
            (valve) =>
                valve.siteId === incident.siteId &&
                valve.status === "open"
        ) ||
        valves.find((valve) => valve.siteId === incident.siteId) ||
        null
    );
}

function buildLocalIncidentEntity(incidentId) {
    const incident = LocalPlatformDataService.getById("incidents", incidentId);

    return incidentAssembler.toEntity({
        ...incident,
        actions: LocalPlatformDataService.list("incidentActions", { incidentId }),
        assignments: LocalPlatformDataService.list("incidentAssignments", { incidentId }),
    });
}

function requestLocalIncidentMitigation(incidentId, payload = {}) {
    const incident = LocalPlatformDataService.getById("incidents", incidentId);

    if (!incident) {
        throw new Error("Incident not found.");
    }

    const valve = findLocalValveForIncident(incident, payload);

    if (!valve) {
        throw new Error("Valve not found.");
    }

    const device = LocalPlatformDataService.getById("devices", payload.deviceId || valve.deviceId);
    const timestamp = new Date().toISOString();
    const requestedBy = payload.requestedBy || "Operations";
    const reason = payload.reason || "Incident mitigation requested.";
    const previousStatus = valve.status || "";

    LocalPlatformDataService.update("valves", valve.id, {
        status: "closed",
        openingPercentage: 0,
    });

    const commandPayload = {
        deviceId: payload.deviceId || valve.deviceId,
        valveId: valve.id,
        siteId: incident.siteId || valve.siteId || device?.siteId || "",
        roomId: incident.roomId || device?.roomId || "",
        deviceGroupId: incident.deviceGroupId || device?.deviceGroupId || "",
        incidentId,
        commandType: "closeValve",
        source: "incident",
        reason,
        requestedBy,
        requestedAt: timestamp,
        status: "executed",
        executedAt: timestamp,
        failureReason: "",
    };
    const deviceCommand = LocalPlatformDataService.create("deviceCommands", commandPayload);
    LocalPlatformDataService.create("commands", {
        id: deviceCommand.id,
        ...commandPayload,
    });

    LocalPlatformDataService.create("commandExecutions", {
        deviceCommandId: deviceCommand.id,
        status: "executed",
        startedAt: timestamp,
        finishedAt: timestamp,
        resultMessage: "Valve closed for incident mitigation.",
        failureReason: "",
    });

    LocalPlatformDataService.create("commandAuditEntries", {
        deviceCommandId: deviceCommand.id,
        action: "executed",
        description: "Valve closed for incident mitigation.",
        performedBy: requestedBy,
        performedAt: timestamp,
    });

    const valveOperation = LocalPlatformDataService.create("valveOperations", {
        valveId: valve.id,
        deviceId: payload.deviceId || valve.deviceId,
        siteId: incident.siteId || valve.siteId || device?.siteId || "",
        roomId: incident.roomId || device?.roomId || "",
        deviceGroupId: incident.deviceGroupId || device?.deviceGroupId || "",
        incidentId,
        resourceType: valve.resourceType || "water",
        previousStatus,
        targetStatus: "closed",
        reason: "incident_mitigation",
        source: "incident",
        status: "executed",
        requestedAt: timestamp,
        completedAt: timestamp,
        failureReason: "",
    });

    LocalPlatformDataService.create("incidentActions", {
        incidentId,
        actionType: "valve_closed",
        description: reason,
        performedBy: requestedBy,
        performedAt: timestamp,
    });

    LocalPlatformDataService.update("incidents", incidentId, {
        status: "in_progress",
    });

    return {
        incident: buildLocalIncidentEntity(incidentId),
        mitigation: {
            incidentId,
            deviceId: payload.deviceId || valve.deviceId,
            valveId: valve.id,
            deviceCommandId: deviceCommand.id,
            valveOperationId: valveOperation.id,
            commandStatus: "executed",
            valveStatus: "closed",
            executedAt: timestamp,
        },
    };
}

function createLocalChannel(payload = {}) {
    return channelAssembler.toEntity(
        LocalPlatformDataService.create("notificationChannels", {
            name: payload.name || "In-app operations",
            type: payload.type || "in_app",
            isActive: payload.isActive ?? true,
            enabled: payload.isActive ?? true,
        })
    );
}

function updateLocalChannelStatus(channelId, isActive) {
    return channelAssembler.toEntity(
        LocalPlatformDataService.update("notificationChannels", channelId, {
            isActive,
            enabled: isActive,
        })
    );
}

function registerLocalAlertDelivery(alertId) {
    const alert = LocalPlatformDataService.getById("alerts", alertId);
    const channels = listLocalChannels();

    if (!alert) return [];

    return channels
        .map((channel) => createLocalDeliveryForAlert(alert, channel))
        .map((delivery) => deliveryAssembler.toEntity(delivery));
}

export class NotificationApiService {
    constructor() {
        this.usingFallback = false;
    }

    isUsingFallback() {
        return this.usingFallback;
    }

    async withBackendFallback(backendAction, localAction) {
        try {
            const result = await backendAction();
            this.usingFallback = false;
            return result;
        } catch (_error) {
            this.usingFallback = true;
            return localAction();
        }
    }

    async getSummary() {
        return this.withBackendFallback(
            async () => normalizeSummary(await ApiClientService.get("/api/v1/notifications/summary")),
            () => buildLocalSummary()
        );
    }

    async getOpenAlerts() {
        return this.withBackendFallback(
            async () => (await ApiClientService.get("/api/v1/alerts/open")).map((alert) => alertAssembler.toEntity(alert)),
            () => listLocalAlerts().filter((alert) => OPEN_ALERT_STATUSES.includes(alert.status))
        );
    }

    async getCriticalAlerts() {
        return this.withBackendFallback(
            async () => (await ApiClientService.get("/api/v1/alerts/critical")).map((alert) => alertAssembler.toEntity(alert)),
            () => listLocalAlerts().filter(
                (alert) => alert.severity === "critical" && OPEN_ALERT_STATUSES.includes(alert.status)
            )
        );
    }

    async getAlerts() {
        return this.getOpenAlerts();
    }

    async getOpenIncidents() {
        return this.withBackendFallback(
            async () => mergeById(
                (await ApiClientService.get("/api/v1/incidents/open"))
                    .map((incident) => incidentAssembler.toEntity(incident)),
                listLocalIncidents().filter((incident) => OPEN_INCIDENT_STATUSES.includes(incident.status))
            ),
            () => listLocalIncidents().filter((incident) => OPEN_INCIDENT_STATUSES.includes(incident.status))
        );
    }

    async getIncidents() {
        return this.getOpenIncidents();
    }

    async getChannels() {
        return this.withBackendFallback(
            async () => (await ApiClientService.get("/api/v1/notification-channels")).map((channel) => channelAssembler.toEntity(channel)),
            () => listLocalChannels()
        );
    }

    async getActiveChannels() {
        return this.withBackendFallback(
            async () => (await ApiClientService.get("/api/v1/notification-channels/active")).map((channel) => channelAssembler.toEntity(channel)),
            () => listLocalChannels().filter((channel) => channel.isActive)
        );
    }

    async getDeliveries() {
        return this.withBackendFallback(
            async () => {
                const alerts = await ApiClientService.get("/api/v1/alerts/open");
                return alerts.flatMap((alert) =>
                    (alert.deliveries || []).map((delivery) => deliveryAssembler.toEntity(delivery))
                );
            },
            () => listLocalDeliveries()
        );
    }

    async acknowledgeAlert(alertId, payload = {}) {
        return this.withBackendFallback(
            async () => alertAssembler.toEntity(
                await ApiClientService.post(`/api/v1/alerts/${alertId}/acknowledge`, {
                    acknowledgedBy: payload.acknowledgedBy || "Operations",
                })
            ),
            () => acknowledgeLocalAlert(alertId, payload)
        );
    }

    async resolveAlert(alertId, payload = {}) {
        return this.withBackendFallback(
            async () => alertAssembler.toEntity(
                await ApiClientService.post(`/api/v1/alerts/${alertId}/resolve`, {
                    resolvedBy: payload.resolvedBy || "Operations",
                    note: payload.note || "",
                })
            ),
            () => resolveLocalAlert(alertId, payload)
        );
    }

    async closeAlert(alertId, payload = {}) {
        return this.withBackendFallback(
            async () => alertAssembler.toEntity(
                await ApiClientService.post(`/api/v1/alerts/${alertId}/close`, {
                    closedBy: payload.closedBy || "Operations",
                    note: payload.note || "",
                })
            ),
            () => closeLocalAlert(alertId, payload)
        );
    }

    async createIncidentFromAlert(alertId, alertSnapshot = null) {
        return this.withBackendFallback(
            async () => incidentAssembler.toEntity(
                await ApiClientService.post(`/api/v1/alerts/${alertId}/incidents`)
            ),
            () => createLocalIncidentFromAlert(alertId, alertSnapshot)
        );
    }

    async assignIncident(incidentId, payload = {}) {
        return this.withBackendFallback(
            async () => incidentAssembler.toEntity(
                await ApiClientService.post(`/api/v1/incidents/${incidentId}/assign`, {
                    assigneeId: payload.assigneeId || payload.assigneeName || "operator",
                    assigneeName: payload.assigneeName || payload.assigneeId || "Operations",
                })
            ),
            () => assignLocalIncident(incidentId, payload)
        );
    }

    async registerIncidentAction(incidentId, payload = {}) {
        return this.withBackendFallback(
            async () => incidentAssembler.toEntity(
                await ApiClientService.post(`/api/v1/incidents/${incidentId}/actions`, {
                    actionType: payload.actionType || "operator_note",
                    description: payload.description || "",
                    performedBy: payload.performedBy || "Operations",
                })
            ),
            () => registerLocalIncidentAction(incidentId, payload)
        );
    }

    async getIncidentActions(incidentId) {
        return this.withBackendFallback(
            async () => (await ApiClientService.get(`/api/v1/incidents/${incidentId}/actions`))
                .map((action) => incidentActionAssembler.toEntity(action)),
            () => LocalPlatformDataService
                .list("incidentActions", { incidentId })
                .map((action) => incidentActionAssembler.toEntity(action))
        );
    }

    async requestIncidentMitigation(incidentId, payload = {}) {
        return this.withBackendFallback(
            async () => {
                const result = await ApiClientService.post(
                    `/api/v1/incidents/${incidentId}/mitigation/close-valve`,
                    {
                        deviceId: payload.deviceId,
                        valveId: payload.valveId,
                        requestedBy: payload.requestedBy || "Operations",
                        reason: payload.reason || "",
                    }
                );

                return {
                    incident: incidentAssembler.toEntity(result.incident || result.Incident),
                    mitigation: result.mitigation || result.Mitigation,
                };
            },
            () => requestLocalIncidentMitigation(incidentId, payload)
        );
    }

    async resolveIncident(incidentId, payload = {}) {
        return this.withBackendFallback(
            async () => incidentAssembler.toEntity(
                await ApiClientService.post(`/api/v1/incidents/${incidentId}/resolve`, {
                    resolvedBy: payload.resolvedBy || "Operations",
                    resolution: payload.resolution || "",
                })
            ),
            () => resolveLocalIncident(incidentId, payload)
        );
    }

    async closeIncident(incidentId, payload = {}) {
        return this.withBackendFallback(
            async () => incidentAssembler.toEntity(
                await ApiClientService.post(`/api/v1/incidents/${incidentId}/close`, {
                    closedBy: payload.closedBy || "Operations",
                    closingNote: payload.closingNote || "",
                })
            ),
            () => closeLocalIncident(incidentId, payload)
        );
    }

    async createChannel(payload = {}) {
        return this.withBackendFallback(
            async () => channelAssembler.toEntity(
                await ApiClientService.post("/api/v1/notification-channels", {
                    name: payload.name || "In-app operations",
                    type: payload.type || "in_app",
                    isActive: payload.isActive ?? true,
                })
            ),
            () => createLocalChannel(payload)
        );
    }

    async activateChannel(channelId) {
        return this.withBackendFallback(
            async () => channelAssembler.toEntity(
                await ApiClientService.post(`/api/v1/notification-channels/${channelId}/activate`)
            ),
            () => updateLocalChannelStatus(channelId, true)
        );
    }

    async deactivateChannel(channelId) {
        return this.withBackendFallback(
            async () => channelAssembler.toEntity(
                await ApiClientService.post(`/api/v1/notification-channels/${channelId}/deactivate`)
            ),
            () => updateLocalChannelStatus(channelId, false)
        );
    }

    async sendAlert(alertId) {
        return this.withBackendFallback(
            async () => {
                const alert = await ApiClientService.get(`/api/v1/alerts/${alertId}`);
                return (alert.deliveries || []).map((delivery) => deliveryAssembler.toEntity(delivery));
            },
            () => registerLocalAlertDelivery(alertId)
        );
    }
}
