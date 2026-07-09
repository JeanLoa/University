import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Threshold } from "../../domain/model/threshold.entity";
import { ThresholdResource } from "../resource/threshold.resource";

export class ThresholdAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Threshold({
            id: resource.id,
            siteId: resource.siteId,
            sensorId: resource.sensorId,
            resourceType: resource.resourceType,
            warningLimit: resource.warningLimit,
            criticalLimit: resource.criticalLimit,
            unit: resource.unit,
            enabled: resource.enabled,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new ThresholdResource({
            id: entity.id,
            siteId: entity.siteId,
            sensorId: entity.sensorId,
            resourceType: entity.resourceType,
            warningLimit: entity.warningLimit,
            criticalLimit: entity.criticalLimit,
            unit: entity.unit,
            enabled: entity.enabled,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}