import { WorkplaceApiService } from "../../infrastructure/api/workplace-api.service";

export class WorkplaceFacade {
    constructor() {
        this.workplaceApiService = new WorkplaceApiService();
    }

    async getWorkplace() {
        return this.workplaceApiService.getWorkplace();
    }

    async getSites(type = "all") {
        return this.workplaceApiService.getSites(type);
    }

    async getSiteById(siteId) {
        return this.workplaceApiService.getSiteById(siteId);
    }

    async createSite(payload) {
        return this.workplaceApiService.createSite(payload);
    }

    async updateSiteStatus(siteId, status, snapshot = null) {
        return this.workplaceApiService.updateSiteStatus(siteId, status, snapshot);
    }

    async deleteSite(siteId, snapshot = null) {
        return this.workplaceApiService.deleteSite(siteId, snapshot);
    }

    async getRoomsBySite(siteId) {
        return this.workplaceApiService.getRoomsBySite(siteId);
    }

    async createRoom(payload) {
        return this.workplaceApiService.createRoom(payload);
    }

    async getDeviceGroupsByRoom(roomId) {
        return this.workplaceApiService.getDeviceGroupsByRoom(roomId);
    }

    async createDeviceGroup(payload) {
        return this.workplaceApiService.createDeviceGroup(payload);
    }

    async addDeviceToGroup(payload) {
        return this.workplaceApiService.addDeviceToGroup(payload);
    }

    async getPhysicalModelBySite(siteId) {
        return this.workplaceApiService.getPhysicalModelBySite(siteId);
    }

    async assignMemberToSite(payload) {
        return this.workplaceApiService.assignMemberToSite(payload);
    }

    async assignDeviceToSite(payload) {
        return this.workplaceApiService.assignDeviceToSite(payload);
    }

    async removeMemberFromSite(memberId) {
        return this.workplaceApiService.removeMemberFromSite(memberId);
    }

    async removeSensorFromGroup(sensorId) {
        return this.workplaceApiService.removeSensorFromGroup(sensorId);
    }

    async removeDeviceFromGroup(deviceId) {
        return this.workplaceApiService.removeDeviceFromGroup(deviceId);
    }

    async updateDeviceStatus(deviceId, status) {
        return this.workplaceApiService.updateDeviceStatus(deviceId, status);
    }

    async updateSensorStatus(sensorId, status) {
        return this.workplaceApiService.updateSensorStatus(sensorId, status);
    }

    async getMembersBySite(siteId) {
        return this.workplaceApiService.getMembersBySite(siteId);
    }

    async getAssignmentsBySite(siteId) {
        return this.workplaceApiService.getAssignmentsBySite(siteId);
    }

    async getSummary() {
        return this.workplaceApiService.getSummary();
    }
}
