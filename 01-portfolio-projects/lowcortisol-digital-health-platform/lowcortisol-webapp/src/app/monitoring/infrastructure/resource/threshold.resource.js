import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class ThresholdResource extends BaseResource {
    constructor({
                    id = null,
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    sensorId = "",
                    resourceType = "water",
                    name = "",
                    operator = "greater_or_equal",
                    limitValue = 0,
                    unit = "L",
                    severity = "warning",
                    isActive = true,
                    location = null,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.name = name;
        this.operator = operator;
        this.limitValue = Number(limitValue || 0);
        this.unit = unit;
        this.severity = severity;
        this.isActive = Boolean(isActive);
        this.location = location;
    }
}
