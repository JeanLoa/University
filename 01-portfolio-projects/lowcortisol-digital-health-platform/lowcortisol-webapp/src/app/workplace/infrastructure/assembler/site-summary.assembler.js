import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { SiteSummary } from "../../domain/model/site-summary.entity";
import { SiteSummaryResource } from "../resource/site-summary.resource";

export class SiteSummaryAssembler extends BaseAssembler {
    toEntity(resource) {
        return new SiteSummary({
            id: resource.id,
            workplaceId: resource.workplaceId,
            totalSites: resource.totalSites,
            activeSites: resource.activeSites,
            maintenanceSites: resource.maintenanceSites,
            totalMembers: resource.totalMembers,
            totalDeviceAssignments: resource.totalDeviceAssignments,
            waterConsumption: resource.waterConsumption,
            gasConsumption: resource.gasConsumption,
            activeSensors: resource.activeSensors,
            activeIncidents: resource.activeIncidents,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SiteSummaryResource({
            id: entity.id,
            workplaceId: entity.workplaceId,
            totalSites: entity.totalSites,
            activeSites: entity.activeSites,
            maintenanceSites: entity.maintenanceSites,
            totalMembers: entity.totalMembers,
            totalDeviceAssignments: entity.totalDeviceAssignments,
            waterConsumption: entity.waterConsumption,
            gasConsumption: entity.gasConsumption,
            activeSensors: entity.activeSensors,
            activeIncidents: entity.activeIncidents,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}