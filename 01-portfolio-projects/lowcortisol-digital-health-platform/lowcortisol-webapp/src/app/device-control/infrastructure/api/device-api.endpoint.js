import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { DeviceAssembler } from "../assembler/device.assembler";

export class DeviceApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/devices", new DeviceAssembler());
    }

    async getDevicesBySite(siteId) {
        const response = await this.getFromPath(`?siteId=${siteId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }

    async executeCommand(deviceId, resource) {
        return this.postToPath(`/${deviceId}/commands`, resource);
    }
}