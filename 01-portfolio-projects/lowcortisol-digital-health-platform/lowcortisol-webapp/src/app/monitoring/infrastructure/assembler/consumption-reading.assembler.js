import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { ConsumptionReading } from "../../domain/model/consumption-reading.entity";
import { ConsumptionReadingResource } from "../resource/consumption-reading.resource";
import { RegisterConsumptionReadingResource } from "../resource/register-consumption-reading.resource";

export class ConsumptionReadingAssembler extends BaseAssembler {
    toEntity(resource) {
        return new ConsumptionReading({
            id: resource.id,
            sessionId: resource.sessionId,
            siteId: resource.siteId,
            roomId: resource.roomId,
            deviceGroupId: resource.deviceGroupId,
            deviceId: resource.deviceId,
            sensorId: resource.sensorId,
            resourceType: resource.resourceType,
            value: resource.value,
            unit: resource.unit,
            capturedAt: resource.capturedAt,
            recordedAt: resource.recordedAt || resource.measuredAt,
            location: resource.location,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new ConsumptionReadingResource({
            id: entity.id,
            sessionId: entity.sessionId,
            siteId: entity.siteId,
            roomId: entity.roomId,
            deviceGroupId: entity.deviceGroupId,
            deviceId: entity.deviceId,
            sensorId: entity.sensorId,
            resourceType: entity.resourceType,
            value: entity.value,
            unit: entity.unit,
            capturedAt: entity.capturedAt,
            location: entity.location,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    toRegisterResource(input) {
        return new RegisterConsumptionReadingResource(input);
    }
}
