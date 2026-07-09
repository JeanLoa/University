export class ExecuteDeviceCommandDto {
    constructor({
                    deviceId = "",
                    commandType = "sync",
                    payload = {},
                } = {}) {
        this.deviceId = deviceId;
        this.commandType = commandType;
        this.payload = payload;
    }

    isValid() {
        return Boolean(this.deviceId && this.commandType);
    }

    toPayload() {
        return {
            deviceId: this.deviceId,
            commandType: this.commandType,
            payload: this.payload,
        };
    }
}