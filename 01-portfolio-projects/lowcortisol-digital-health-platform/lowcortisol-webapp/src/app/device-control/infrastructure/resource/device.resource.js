import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class DeviceResource extends BaseResource {
    constructor({
                    id = null,
                    siteId = "",
                    name = "",
                    type = "hub",
                    status = "online",
                    sensors = [],
                    valves = [],
                    commands = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.name = name;
        this.type = type;
        this.status = status;
        this.sensors = sensors;
        this.valves = valves;
        this.commands = commands;
    }
}