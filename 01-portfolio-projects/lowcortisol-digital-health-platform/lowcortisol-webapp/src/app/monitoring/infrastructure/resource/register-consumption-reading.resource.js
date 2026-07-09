export class RegisterConsumptionReadingResource {
    constructor({
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    deviceId = "",
                    sensorId = "",
                    resourceType = "water",
                    value = 0,
                    unit = "L",
                    capturedAt = null,
                } = {}) {
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.deviceId = deviceId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.value = Number(value || 0);
        this.unit = unit;
        this.capturedAt = capturedAt || null;
    }
}
