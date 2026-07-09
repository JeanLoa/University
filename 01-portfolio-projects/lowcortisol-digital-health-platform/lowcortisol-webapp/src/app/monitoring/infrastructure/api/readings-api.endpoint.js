import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { ConsumptionReadingAssembler } from "../assembler/consumption-reading.assembler";

export class ReadingsApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/readings", new ConsumptionReadingAssembler());
    }

    async getReadingsBySite(siteId) {
        const response = await this.getFromPath(`?siteId=${siteId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }

    async getReadingsByResource(resourceType) {
        const response = await this.getFromPath(`?resourceType=${resourceType}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }
}