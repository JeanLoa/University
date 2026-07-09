import { NotificationApiService } from "../../infrastructure/api/notification-api.service";

export class NotificationFacade {
    constructor() {
        this.notificationApiService = new NotificationApiService();
    }

    isUsingFallback() {
        return this.notificationApiService.isUsingFallback();
    }

    async getSummary() {
        return this.notificationApiService.getSummary();
    }

    async getOpenAlerts() {
        return this.notificationApiService.getOpenAlerts();
    }

    async getCriticalAlerts() {
        return this.notificationApiService.getCriticalAlerts();
    }

    async getAlerts() {
        return this.notificationApiService.getAlerts();
    }

    async getOpenIncidents() {
        return this.notificationApiService.getOpenIncidents();
    }

    async getIncidents() {
        return this.notificationApiService.getIncidents();
    }

    async getChannels() {
        return this.notificationApiService.getChannels();
    }

    async getActiveChannels() {
        return this.notificationApiService.getActiveChannels();
    }

    async getDeliveries() {
        return this.notificationApiService.getDeliveries();
    }

    async acknowledgeAlert(alertId, payload) {
        return this.notificationApiService.acknowledgeAlert(alertId, payload);
    }

    async resolveAlert(alertId, payload) {
        return this.notificationApiService.resolveAlert(alertId, payload);
    }

    async closeAlert(alertId, payload) {
        return this.notificationApiService.closeAlert(alertId, payload);
    }

    async createIncidentFromAlert(alertId, alertSnapshot = null) {
        return this.notificationApiService.createIncidentFromAlert(alertId, alertSnapshot);
    }

    async assignIncident(incidentId, payload) {
        return this.notificationApiService.assignIncident(incidentId, payload);
    }

    async registerIncidentAction(incidentId, payload) {
        return this.notificationApiService.registerIncidentAction(incidentId, payload);
    }

    async getIncidentActions(incidentId) {
        return this.notificationApiService.getIncidentActions(incidentId);
    }

    async requestIncidentMitigation(incidentId, payload) {
        return this.notificationApiService.requestIncidentMitigation(incidentId, payload);
    }

    async resolveIncident(incidentId, payload) {
        return this.notificationApiService.resolveIncident(incidentId, payload);
    }

    async closeIncident(incidentId, payload) {
        return this.notificationApiService.closeIncident(incidentId, payload);
    }

    async createChannel(payload) {
        return this.notificationApiService.createChannel(payload);
    }

    async activateChannel(channelId) {
        return this.notificationApiService.activateChannel(channelId);
    }

    async deactivateChannel(channelId) {
        return this.notificationApiService.deactivateChannel(channelId);
    }

    async sendAlert(alertId) {
        return this.notificationApiService.sendAlert(alertId);
    }
}
