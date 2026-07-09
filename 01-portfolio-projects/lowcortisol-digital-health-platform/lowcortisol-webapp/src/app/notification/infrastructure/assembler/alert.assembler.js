import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Alert } from "../../domain/model/alert.entity";
import { AlertResource } from "../resource/alert.resource";
import { AlertDeliveryAssembler } from "./alert-delivery.assembler";
import { normalizeDate, normalizeEnum } from "./notification-field-normalizer";

const deliveryAssembler = new AlertDeliveryAssembler();

export class AlertAssembler extends BaseAssembler {
    toEntity(resource = {}) {
        const deliveries = Array.isArray(resource.deliveries)
            ? resource.deliveries.map((delivery) => deliveryAssembler.toEntity(delivery))
            : [];

        return new Alert({
            id: resource.id,
            title: resource.title,
            description: resource.description,
            severity: normalizeEnum(resource.severity, "warning"),
            status: normalizeEnum(resource.status, "open"),
            sourceType: normalizeEnum(resource.sourceType, "threshold"),
            anomalyId: resource.anomalyId,
            readingId: resource.readingId,
            siteId: resource.siteId,
            roomId: resource.roomId,
            deviceGroupId: resource.deviceGroupId,
            deviceId: resource.deviceId,
            sensorId: resource.sensorId,
            resourceType: normalizeEnum(resource.resourceType, "water"),
            minutesToAcknowledge: resource.minutesToAcknowledge,
            minutesToResolve: resource.minutesToResolve,
            acknowledgedAt: resource.acknowledgedAt,
            resolvedAt: resource.resolvedAt,
            closedAt: resource.closedAt,
            deliveries,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity = {}) {
        return new AlertResource({
            id: entity.id,
            title: entity.title,
            description: entity.description,
            severity: normalizeEnum(entity.severity, "warning"),
            status: normalizeEnum(entity.status, "open"),
            sourceType: normalizeEnum(entity.sourceType, "threshold"),
            anomalyId: entity.anomalyId,
            readingId: entity.readingId,
            siteId: entity.siteId,
            roomId: entity.roomId,
            deviceGroupId: entity.deviceGroupId,
            deviceId: entity.deviceId,
            sensorId: entity.sensorId,
            resourceType: normalizeEnum(entity.resourceType, "water"),
            minutesToAcknowledge: entity.minutesToAcknowledge,
            minutesToResolve: entity.minutesToResolve,
            acknowledgedAt: normalizeDate(entity.acknowledgedAt),
            resolvedAt: normalizeDate(entity.resolvedAt),
            closedAt: normalizeDate(entity.closedAt),
            deliveries: (entity.deliveries || []).map((delivery) => deliveryAssembler.toResource(delivery)),
            createdAt: normalizeDate(entity.createdAt),
            updatedAt: normalizeDate(entity.updatedAt),
        });
    }
}
