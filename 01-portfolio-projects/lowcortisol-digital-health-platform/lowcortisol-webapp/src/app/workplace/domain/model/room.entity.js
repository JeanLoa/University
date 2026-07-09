import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Room extends BaseEntity {
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

    get isActive() {
        return this.status === "active";
    }
}
