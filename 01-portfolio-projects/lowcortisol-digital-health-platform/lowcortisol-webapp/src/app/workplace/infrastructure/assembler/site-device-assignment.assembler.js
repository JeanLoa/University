import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { SiteDeviceAssignment } from "../../domain/model/site-device-assignment.entity";
import { SiteDeviceAssignmentResource } from "../resource/site-device-assignment.resource";

export class SiteDeviceAssignmentAssembler extends BaseAssembler {
    toEntity(resource) {
        return new SiteDeviceAssignment({
            id: resource.id,
            siteId: resource.siteId,
            deviceId: resource.deviceId,
            deviceName: resource.deviceName,
            deviceType: resource.deviceType,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SiteDeviceAssignmentResource({
            id: entity.id,
            siteId: entity.siteId,
            deviceId: entity.deviceId,
            deviceName: entity.deviceName,
            deviceType: entity.deviceType,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}