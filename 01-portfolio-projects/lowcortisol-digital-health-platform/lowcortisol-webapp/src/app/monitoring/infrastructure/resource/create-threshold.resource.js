export class CreateThresholdResource {
    constructor({
                    siteId = null,
                    roomId = null,
                    deviceGroupId = null,
                    sensorId = null,
                    resourceType = "water",
                    name = "",
                    operator = "greater_or_equal",
                    limitValue = 0,
                    unit = "L",
                    severity = "warning",
                    isActive = true,
                } = {}) {
        this.siteId = siteId || null;
        this.roomId = roomId || null;
        this.deviceGroupId = deviceGroupId || null;
        this.sensorId = sensorId || null;
        this.resourceType = resourceType;
        this.name = name;
        this.operator = operator;
        this.limitValue = Number(limitValue || 0);
        this.unit = unit;
        this.severity = severity;
        this.isActive = Boolean(isActive);
    }
}
