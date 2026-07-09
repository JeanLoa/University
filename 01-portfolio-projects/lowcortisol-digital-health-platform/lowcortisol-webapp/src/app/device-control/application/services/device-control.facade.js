import { DeviceControlApiService } from "../../infrastructure/api/device-control-api.service";

export class DeviceControlFacade {
    constructor() {
        this.deviceControlApiService = new DeviceControlApiService();
    }

    isUsingFallback() {
        return this.deviceControlApiService.isUsingFallback();
    }

    async getDevices() {
        return this.deviceControlApiService.getDevices();
    }

    async getDeviceById(deviceId) {
        return this.deviceControlApiService.getDeviceById(deviceId);
    }

    async getDevicesBySite(siteId) {
        return this.deviceControlApiService.getDevicesBySite(siteId);
    }

    async createDevice(payload) {
        return this.deviceControlApiService.createDevice(payload);
    }

    async createConduit(payload) {
        return this.deviceControlApiService.createConduit(payload);
    }

    async removeConduit(conduitId) {
        return this.deviceControlApiService.removeConduit(conduitId);
    }

    async activateConduit(conduitId) {
        return this.deviceControlApiService.activateConduit(conduitId);
    }

    async deactivateConduit(conduitId) {
        return this.deviceControlApiService.deactivateConduit(conduitId);
    }

    async getSensors() {
        return this.deviceControlApiService.getSensors();
    }

    async linkSensor(payload) {
        return this.deviceControlApiService.linkSensor(payload);
    }

    async getValves() {
        return this.deviceControlApiService.getValves();
    }

    async updateValveStatus(payload) {
        return this.deviceControlApiService.updateValveStatus(payload);
    }

    async executeCommand(payload) {
        return this.deviceControlApiService.executeCommand(payload);
    }

    async getCommands() {
        return this.deviceControlApiService.getCommands();
    }

    async getDeviceCommandsByDeviceId(deviceId) {
        return this.deviceControlApiService.getDeviceCommandsByDeviceId(deviceId);
    }

    async getValveOperationsByValveId(valveId) {
        return this.deviceControlApiService.getValveOperationsByValveId(valveId);
    }

    async getValveOperationsByIncidentId(incidentId) {
        return this.deviceControlApiService.getValveOperationsByIncidentId(incidentId);
    }

    async getMitigationSummary() {
        return this.deviceControlApiService.getMitigationSummary();
    }

    async getSummary() {
        return this.deviceControlApiService.getSummary();
    }
}
