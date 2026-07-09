export class LinkSensorDto {
    constructor({
                    deviceId = "",
                    siteId = "",
                    name = "",
                    resourceType = "water",
                    unit = "L",
                    threshold = 100,
                } = {}) {
        this.deviceId = deviceId;
        this.siteId = siteId;
        this.name = name.trim();
        this.resourceType = resourceType;
        this.unit = unit;
        this.threshold = threshold;
    }

    isValid() {
        return Boolean(this.deviceId && this.siteId && this.name && this.resourceType);
    }

    toPayload() {
        return {
            deviceId: this.deviceId,
            siteId: this.siteId,
            name: this.name,
            resourceType: this.resourceType,
            unit: this.unit,
            threshold: this.threshold,
        };
    }
}