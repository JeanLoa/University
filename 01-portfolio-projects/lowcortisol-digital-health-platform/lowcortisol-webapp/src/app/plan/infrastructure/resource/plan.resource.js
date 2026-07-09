import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class PlanResource extends BaseResource {
    constructor({
                    id = null,
                    name = "",
                    code = "basic",
                    description = "",
                    price = 0,
                    currency = "PEN",
                    billingPeriod = "monthly",
                    maxSites = 1,
                    maxDevices = 3,
                    features = [],
                    recommended = false,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.name = name;
        this.code = code;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.billingPeriod = billingPeriod;
        this.maxSites = maxSites;
        this.maxDevices = maxDevices;
        this.features = features;
        this.recommended = recommended;
    }
}