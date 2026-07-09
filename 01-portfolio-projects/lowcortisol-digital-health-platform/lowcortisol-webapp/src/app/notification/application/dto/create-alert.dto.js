export class CreateAlertDto {
    constructor({
                    siteId = "",
                    sensorId = "",
                    resourceType = "water",
                    title = "",
                    description = "",
                    severity = "warning",
                } = {}) {
        this.siteId = siteId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.title = title.trim();
        this.description = description.trim();
        this.severity = severity;
    }

    isValid() {
        return Boolean(this.siteId && this.title && this.severity);
    }

    toPayload() {
        return {
            siteId: this.siteId,
            sensorId: this.sensorId,
            resourceType: this.resourceType,
            title: this.title,
            description: this.description,
            severity: this.severity,
        };
    }
}