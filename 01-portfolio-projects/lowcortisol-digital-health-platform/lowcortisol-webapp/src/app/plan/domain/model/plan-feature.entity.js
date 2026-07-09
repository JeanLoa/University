import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class PlanFeature extends BaseEntity {
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