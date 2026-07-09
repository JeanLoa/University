export class CreateThresholdDto {
    constructor({
                    siteId = "",
                    sensorId = "",
                    resourceType = "water",
                    warningLimit = 250,
                    criticalLimit = 320,
                    unit = "L",
                } = {}) {
        this.siteId = siteId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.warningLimit = warningLimit;
        this.criticalLimit = criticalLimit;
        this.unit = unit;
    }

    isValid() {
        return Boolean(this.siteId && this.resourceType && this.unit);
    }

    toPayload() {
        return {
            siteId: this.siteId,
            sensorId: this.sensorId,
            resourceType: this.resourceType,
            warningLimit: this.warningLimit,
            criticalLimit: this.criticalLimit,
            unit: this.unit,
        };
    }
}