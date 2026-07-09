import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { PlanAssembler } from "../assembler/plan.assembler";

export class PlanApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/plans", new PlanAssembler());
    }

    async getRecommendedPlans() {
        const response = await this.getFromPath("?recommended=true");
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }
}