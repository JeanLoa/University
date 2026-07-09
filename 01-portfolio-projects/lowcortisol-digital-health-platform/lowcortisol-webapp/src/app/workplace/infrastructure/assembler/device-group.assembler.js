import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { DeviceGroup } from "../../domain/model/device-group.entity";
import { DeviceGroupResource } from "../resource/device-group.resource";

export class DeviceGroupAssembler extends BaseAssembler {
    toEntity(resource) {
        return new DeviceGroup({
            id: resource.id,
            roomId: resource.roomId,
            name: resource.name,
            resourceType: resource.resourceType,
            status: resource.status,
            devices: resource.devices || [],
            sensors: resource.sensors || [],
            valves: resource.valves || [],
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new DeviceGroupResource({
            id: entity.id,
            roomId: entity.roomId,
            name: entity.name,
            resourceType: entity.resourceType,
            status: entity.status,
            devices: entity.devices,
            sensors: entity.sensors,
            valves: entity.valves,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
