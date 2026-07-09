import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SiteDeviceAssignmentResource extends BaseResource {
    constructor({
                    id = null,
                    siteId = "",
                    deviceId = "",
                    deviceName = "",
                    deviceType = "sensor",
                    status = "linked",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.deviceType = deviceType;
        this.status = status;
    }
}