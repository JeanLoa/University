import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SiteSummaryResource extends BaseResource {
    constructor({
                    id = null,
                    workplaceId = "",
                    totalSites = 0,
                    activeSites = 0,
                    maintenanceSites = 0,
                    totalMembers = 0,
                    totalDeviceAssignments = 0,
                    waterConsumption = 0,
                    gasConsumption = 0,
                    activeSensors = 0,
                    activeIncidents = 0,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.workplaceId = workplaceId;
        this.totalSites = totalSites;
        this.activeSites = activeSites;
        this.maintenanceSites = maintenanceSites;
        this.totalMembers = totalMembers;
        this.totalDeviceAssignments = totalDeviceAssignments;
        this.waterConsumption = waterConsumption;
        this.gasConsumption = gasConsumption;
        this.activeSensors = activeSensors;
        this.activeIncidents = activeIncidents;
    }
}