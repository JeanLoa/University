import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class DeviceGroup extends BaseEntity {
    constructor({
                    id = null,
                    roomId = "",
                    name = "",
                    resourceType = "mixed",
                    status = "active",
                    devices = [],
                    sensors = [],
                    valves = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.roomId = roomId;
        this.name = name;
        this.resourceType = resourceType;
        this.status = status;
        this.devices = devices;
        this.sensors = sensors;
        this.valves = valves;
    }

    get assignedDeviceCount() {
        return this.devices.length;
    }
}
