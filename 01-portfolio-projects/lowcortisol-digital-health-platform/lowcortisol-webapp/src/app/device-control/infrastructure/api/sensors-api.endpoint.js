import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { SensorAssembler } from "../assembler/sensor.assembler";

export class SensorsApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/sensors", new SensorAssembler());
    }

    async getSensorsByDevice(deviceId) {
        const response = await this.getFromPath(`?deviceId=${deviceId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }

    async getSensorsBySite(siteId) {
        const response = await this.getFromPath(`?siteId=${siteId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }
}