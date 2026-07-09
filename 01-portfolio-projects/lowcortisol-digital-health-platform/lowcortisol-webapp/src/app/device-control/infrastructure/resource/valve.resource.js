import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class ValveResource extends BaseResource {
    constructor({
                    id = null,
                    deviceId = "",
                    siteId = "",
                    name = "",
                    resourceType = "gas",
                    status = "open",
                    openingPercentage = 100,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.deviceId = deviceId;
        this.siteId = siteId;
        this.name = name;
        this.resourceType = resourceType;
        this.status = status;
        this.openingPercentage = openingPercentage;
    }
}