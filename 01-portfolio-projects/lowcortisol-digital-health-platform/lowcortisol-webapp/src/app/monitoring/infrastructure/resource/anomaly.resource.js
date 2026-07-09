import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class AnomalyResource extends BaseResource {
    constructor({
                    id = null,
                    readingId = "",
                    thresholdId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    deviceId = "",
                    sensorId = "",
                    resourceType = "water",
                    value = 0,
                    limitValue = 0,
                    unit = "",
                    severity = "warning",
                    description = "",
                    location = null,
                    detectedAt = new Date(),
                    status = "open",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.readingId = readingId;
        this.thresholdId = thresholdId;
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.deviceId = deviceId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.value = Number(value || 0);
        this.limitValue = Number(limitValue || 0);
        this.unit = unit;
        this.severity = severity;
        this.description = description;
        this.location = location;
        this.detectedAt = detectedAt;
        this.status = status;
    }
}
