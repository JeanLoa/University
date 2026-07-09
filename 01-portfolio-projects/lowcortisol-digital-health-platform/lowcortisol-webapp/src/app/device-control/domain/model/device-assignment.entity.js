import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class DeviceAssignment extends BaseEntity {
    constructor({
                    id = null,
                    deviceId = "",
                    siteId = "",
                    assignedAt = new Date(),
                    status = "linked",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.deviceId = deviceId;
        this.siteId = siteId;
        this.assignedAt = assignedAt ? new Date(assignedAt) : new Date();
        this.status = status;
    }

    unlink() {
        this.status = "unlinked";
        this.updateTimestamp();
    }

    relink() {
        this.status = "linked";
        this.updateTimestamp();
    }

    get isLinked() {
        return this.status === "linked";
    }
}