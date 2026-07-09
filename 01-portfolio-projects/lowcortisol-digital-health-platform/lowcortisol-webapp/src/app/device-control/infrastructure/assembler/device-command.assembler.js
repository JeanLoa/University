import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { DeviceCommand } from "../../domain/model/device-command.entity";
import { DeviceCommandResource } from "../resource/device-command.resource";

export class DeviceCommandAssembler extends BaseAssembler {
    toEntity(resource) {
        if (!resource) return null;

        return new DeviceCommand({
            id: resource.id,
            deviceId: resource.deviceId,
            valveId: resource.valveId || "",
            siteId: resource.siteId || "",
            roomId: resource.roomId || "",
            deviceGroupId: resource.deviceGroupId || "",
            incidentId: resource.incidentId || "",
            commandType: resource.commandType || "sync",
            source: resource.source || "manual",
            reason: resource.reason || "",
            requestedBy: resource.requestedBy || "",
            requestedAt: resource.requestedAt || resource.createdAt,
            status: resource.status || "pending",
            executedAt: resource.executedAt || null,
            failureReason: resource.failureReason || "",
            payload: resource.payload || {},
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        if (!entity) return null;

        return new DeviceCommandResource({
            id: entity.id,
            deviceId: entity.deviceId,
            valveId: entity.valveId,
            siteId: entity.siteId,
            roomId: entity.roomId,
            deviceGroupId: entity.deviceGroupId,
            incidentId: entity.incidentId,
            commandType: entity.commandType,
            source: entity.source,
            reason: entity.reason,
            requestedBy: entity.requestedBy,
            requestedAt: entity.requestedAt,
            status: entity.status,
            executedAt: entity.executedAt,
            failureReason: entity.failureReason,
            payload: entity.payload,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
