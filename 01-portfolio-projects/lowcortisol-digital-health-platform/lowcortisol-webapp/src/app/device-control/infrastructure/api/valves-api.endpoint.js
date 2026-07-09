import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { ValveAssembler } from "../assembler/valve.assembler";

export class ValvesApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/valves", new ValveAssembler());
    }

    async getValvesByDevice(deviceId) {
        const response = await this.getFromPath(`?deviceId=${deviceId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }

    async closeValve(valveId) {
        const response = await this.postToPath(`/${valveId}/close`);
        const resource = response?.data ?? response;

        return this.assembler.toEntity(resource);
    }

    async openValve(valveId) {
        const response = await this.postToPath(`/${valveId}/open`);
        const resource = response?.data ?? response;

        return this.assembler.toEntity(resource);
    }
}