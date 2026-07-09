import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Anomaly } from "../../domain/model/anomaly.entity";
import { AnomalyResource } from "../resource/anomaly.resource";

export class AnomalyAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Anomaly({
            id: resource.id,
            readingId: resource.readingId,
            thresholdId: resource.thresholdId,
            siteId: resource.siteId,
            roomId: resource.roomId,
            deviceGroupId: resource.deviceGroupId,
            deviceId: resource.deviceId,
            sensorId: resource.sensorId,
            resourceType: resource.resourceType,
            value: resource.value,
            limitValue: resource.limitValue,
            unit: resource.unit,
            severity: resource.severity,
            description: resource.description,
            location: resource.location,
            detectedAt: resource.detectedAt,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new AnomalyResource({
            id: entity.id,
            readingId: entity.readingId,
            thresholdId: entity.thresholdId,
            siteId: entity.siteId,
            roomId: entity.roomId,
            deviceGroupId: entity.deviceGroupId,
            deviceId: entity.deviceId,
            sensorId: entity.sensorId,
            resourceType: entity.resourceType,
            value: entity.value,
            limitValue: entity.limitValue,
            unit: entity.unit,
            severity: entity.severity,
            description: entity.description,
            location: entity.location,
            detectedAt: entity.detectedAt,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
