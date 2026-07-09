import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class ConsumptionReadingResource extends BaseResource {
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
        this.capturedAt = capturedAt || recordedAt;
        this.recordedAt = this.capturedAt;
        this.location = location;
        this.status = status;
    }
}
