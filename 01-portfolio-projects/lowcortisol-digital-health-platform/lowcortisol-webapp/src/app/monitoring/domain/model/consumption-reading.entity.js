import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class ConsumptionReading extends BaseEntity {
    constructor({
                    id = null,
                    sessionId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    deviceId = "",
                    sensorId = "",
                    resourceType = "water",
                    value = 0,
                    unit = "L",
                    capturedAt = null,
                    recordedAt = null,
                    location = null,
                    status = "normal",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.sessionId = sessionId;
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.deviceId = deviceId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.value = Number(value || 0);
        this.unit = unit;
        this.capturedAt = new Date(capturedAt || recordedAt || new Date());
        this.recordedAt = this.capturedAt;
        this.location = location;
        this.status = status;
    }

    markAsWarning() {
        this.status = "warning";
        this.updateTimestamp();
    }

    markAsCritical() {
        this.status = "critical";
        this.updateTimestamp();
    }

    get locationLabel() {
        if (!this.location) return "";

        return [
            this.location.siteName,
            this.location.roomName,
            this.location.deviceGroupName,
            this.location.deviceName,
            this.location.sensorName,
        ].filter(Boolean).join(" / ");
    }
}
