import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { ValveOperation } from "../../domain/model/valve-operation.entity";
import { ValveOperationResource } from "../resource/valve-operation.resource";

export class ValveOperationAssembler extends BaseAssembler {
    toEntity(resource) {
        if (!resource) return null;

        return new ValveOperation({
            id: resource.id,
            valveId: resource.valveId || "",
            deviceId: resource.deviceId || "",
            siteId: resource.siteId || "",
            roomId: resource.roomId || "",
            deviceGroupId: resource.deviceGroupId || "",
            incidentId: resource.incidentId || "",
            resourceType: resource.resourceType || "water",
            previousStatus: resource.previousStatus || "",
            targetStatus: resource.targetStatus || "closed",
            reason: resource.reason || "",
            source: resource.source || "manual",
            status: resource.status || "executed",
            requestedAt: resource.requestedAt || resource.createdAt,
            completedAt: resource.completedAt || null,
            failureReason: resource.failureReason || "",
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        if (!entity) return null;

        return new ValveOperationResource({
            id: entity.id,
            valveId: entity.valveId,
            deviceId: entity.deviceId,
            siteId: entity.siteId,
            roomId: entity.roomId,
            deviceGroupId: entity.deviceGroupId,
            incidentId: entity.incidentId,
            resourceType: entity.resourceType,
            previousStatus: entity.previousStatus,
            targetStatus: entity.targetStatus,
            reason: entity.reason,
            source: entity.source,
            status: entity.status,
            requestedAt: entity.requestedAt,
            completedAt: entity.completedAt,
            failureReason: entity.failureReason,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
