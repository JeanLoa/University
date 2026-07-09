import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class DeviceAssignmentResource extends BaseResource {
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
        this.assignedAt = assignedAt;
        this.status = status;
    }
}