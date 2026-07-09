import { MonitoringApiService } from "../../infrastructure/api/monitoring-api.service";

export class MonitoringFacade {
    constructor() {
        this.monitoringApiService = new MonitoringApiService();
    }

    async getSession() {
        return this.monitoringApiService.getSession();
    }

    async getRecentReadings(payload = {}) {
        return this.monitoringApiService.getReadings(payload);
    }

    async getReadings(payload = {}) {
        return this.getRecentReadings(payload);
    }

    async registerReading(payload) {
        return this.monitoringApiService.registerReading(payload);
    }

    async createReading(payload) {
        return this.monitoringApiService.createReading(payload);
    }

    async getActiveThresholds() {
        return this.monitoringApiService.getActiveThresholds();
    }

    async createThreshold(payload) {
        return this.monitoringApiService.createThreshold(payload);
    }

    async getOpenAnomalies() {
        return this.monitoringApiService.getAnomalies();
    }

    async getAnomalies() {
        return this.getOpenAnomalies();
    }

    async resolveAnomaly(anomalyId) {
        return this.monitoringApiService.resolveAnomaly(anomalyId);
    }

    async getReports() {
        return this.monitoringApiService.getReports();
    }

    async createReport(payload) {
        return this.monitoringApiService.createReport(payload);
    }

    async getSummary() {
        return this.monitoringApiService.getSummary();
    }

    async getPhysicalOptions() {
        return this.monitoringApiService.getPhysicalOptions();
    }
}
