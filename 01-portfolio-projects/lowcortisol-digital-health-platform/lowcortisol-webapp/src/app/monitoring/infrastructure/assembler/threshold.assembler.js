import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Threshold } from "../../domain/model/threshold.entity";
import { CreateThresholdResource } from "../resource/create-threshold.resource";
import { ThresholdResource } from "../resource/threshold.resource";

export class ThresholdAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Threshold({
            id: resource.id,
            siteId: resource.siteId,
            roomId: resource.roomId,
            deviceGroupId: resource.deviceGroupId,
            sensorId: resource.sensorId,
            resourceType: resource.resourceType,
            name: resource.name,
            operator: resource.operator,
            limitValue: resource.limitValue,
            unit: resource.unit,
            severity: resource.severity,
            isActive: resource.isActive ?? resource.enabled ?? true,
            location: resource.location,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new ThresholdResource({
            id: entity.id,
            siteId: entity.siteId,
            roomId: entity.roomId,
            deviceGroupId: entity.deviceGroupId,
            sensorId: entity.sensorId,
            resourceType: entity.resourceType,
            name: entity.name,
            operator: entity.operator,
            limitValue: entity.limitValue,
            unit: entity.unit,
            severity: entity.severity,
            isActive: entity.isActive,
            location: entity.location,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    toCreateResource(input) {
        return new CreateThresholdResource(input);
    }
}
