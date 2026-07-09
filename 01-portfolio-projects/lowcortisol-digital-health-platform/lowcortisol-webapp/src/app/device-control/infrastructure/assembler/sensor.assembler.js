import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Sensor } from "../../domain/model/sensor.entity";
import { SensorResource } from "../resource/sensor.resource";

export class SensorAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Sensor({
            id: resource.id,
            deviceId: resource.deviceId,
            siteId: resource.siteId,
            name: resource.name,
            resourceType: resource.resourceType,
            status: resource.status,
            currentValue: resource.currentValue,
            unit: resource.unit,
            threshold: resource.threshold,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SensorResource({
            id: entity.id,
            deviceId: entity.deviceId,
            siteId: entity.siteId,
            name: entity.name,
            resourceType: entity.resourceType,
            status: entity.status,
            currentValue: entity.currentValue,
            unit: entity.unit,
            threshold: entity.threshold,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}