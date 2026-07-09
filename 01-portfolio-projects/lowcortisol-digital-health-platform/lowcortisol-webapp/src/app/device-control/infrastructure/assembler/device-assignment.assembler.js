import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { DeviceAssignment } from "../../domain/model/device-assignment.entity";
import { DeviceAssignmentResource } from "../resource/device-assignment.resource";

export class DeviceAssignmentAssembler extends BaseAssembler {
    toEntity(resource) {
        return new DeviceAssignment({
            id: resource.id,
            deviceId: resource.deviceId,
            siteId: resource.siteId,
            assignedAt: resource.assignedAt,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new DeviceAssignmentResource({
            id: entity.id,
            deviceId: entity.deviceId,
            siteId: entity.siteId,
            assignedAt: entity.assignedAt,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}