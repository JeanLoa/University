import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { WorkplaceAssembler } from "../assembler/workplace.assembler";

export class WorkplacesApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/workplaces", new WorkplaceAssembler());
    }

    async getCurrentWorkplace() {
        const response = await this.getFromPath("/current");
        const resource = response?.data ?? response;

        return this.assembler.toEntity(resource);
    }
}