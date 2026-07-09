import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { SiteAssembler } from "../assembler/site.assembler";

export class SiteApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/sites", new SiteAssembler());
    }

    async getSitesByWorkplace(workplaceId) {
        const response = await this.getFromPath(`?workplaceId=${workplaceId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }

    async getSitesByType(type) {
        const response = await this.getFromPath(`?type=${type}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }

    async getActiveSites() {
        const response = await this.getFromPath("/active");
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }
}