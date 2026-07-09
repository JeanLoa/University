import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Room } from "../../domain/model/room.entity";
import { RoomResource } from "../resource/room.resource";
import { DeviceGroupAssembler } from "./device-group.assembler";

const deviceGroupAssembler = new DeviceGroupAssembler();

export class RoomAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Room({
            id: resource.id,
            siteId: resource.siteId,
            name: resource.name,
            type: resource.type,
            status: resource.status,
            deviceGroups: (resource.deviceGroups || []).map((group) =>
                deviceGroupAssembler.toEntity(group)
            ),
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new RoomResource({
            id: entity.id,
            siteId: entity.siteId,
            name: entity.name,
            type: entity.type,
            status: entity.status,
            deviceGroups: entity.deviceGroups.map((group) =>
                deviceGroupAssembler.toResource(group)
            ),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
