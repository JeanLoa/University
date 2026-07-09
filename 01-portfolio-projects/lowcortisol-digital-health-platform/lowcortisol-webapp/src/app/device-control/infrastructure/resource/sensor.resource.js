import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SensorResource extends BaseResource {
    constructor({
                    id = null,
                    deviceId = "",
                    siteId = "",
                    name = "",
                    resourceType = "water",
                    status = "active",
                    currentValue = 0,
                    unit = "L",
                    threshold = 100,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.deviceId = deviceId;
        this.siteId = siteId;
        this.name = name;
        this.resourceType = resourceType;
        this.status = status;
        this.currentValue = currentValue;
        this.unit = unit;
        this.threshold = threshold;
    }
}