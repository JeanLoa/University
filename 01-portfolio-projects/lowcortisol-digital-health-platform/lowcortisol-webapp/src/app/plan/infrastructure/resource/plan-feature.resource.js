import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class PlanFeatureResource extends BaseResource {
    constructor({
                    id = null,
                    planId = "",
                    name = "",
                    description = "",
                    included = true,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.planId = planId;
        this.name = name;
        this.description = description;
        this.included = included;
    }
}