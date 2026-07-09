import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class RoomResource extends BaseResource {
    constructor({
                    id = null,
                    siteId = "",
                    name = "",
                    type = "custom",
                    status = "active",
                    deviceGroups = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.name = name;
        this.type = type;
        this.status = status;
        this.deviceGroups = deviceGroups;
    }
}
