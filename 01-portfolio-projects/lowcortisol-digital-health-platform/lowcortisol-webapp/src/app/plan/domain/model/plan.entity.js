import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Plan extends BaseEntity {
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

    addFeature(feature) {
        this.features.push(feature);
        this.updateTimestamp();
    }

    get priceLabel() {
        return `S/ ${Number(this.price).toFixed(2)}`;
    }

    get billingPeriodLabel() {
        const labels = {
            monthly: "mensual",
            yearly: "anual",
        };

        return labels[this.billingPeriod] ?? "periodo";
    }

    get capacityLabel() {
        return `${this.maxSites} sede(s) · ${this.maxDevices} dispositivo(s)`;
    }
}