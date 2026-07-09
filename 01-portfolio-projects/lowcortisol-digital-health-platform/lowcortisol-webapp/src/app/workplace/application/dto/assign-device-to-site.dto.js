export class AssignDeviceToSiteDto {
    constructor({
                    siteId = "",
                    deviceId = "",
                    deviceName = "",
                    deviceType = "sensor",
                } = {}) {
        this.siteId = siteId;
        this.deviceId = deviceId;
        this.deviceName = deviceName.trim();
        this.deviceType = deviceType;
    }

    isValid() {
        return Boolean(this.siteId && this.deviceId && this.deviceName);
    }

    toPayload() {
        return {
            siteId: this.siteId,
            deviceId: this.deviceId,
            deviceName: this.deviceName,
            deviceType: this.deviceType,
        };
    }
}