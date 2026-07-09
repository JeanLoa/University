import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Plan } from "../../domain/model/plan.entity";
import { PlanResource } from "../resource/plan.resource";
import { PlanFeatureAssembler } from "./plan-feature.assembler";

export class PlanAssembler extends BaseAssembler {
    constructor() {
        super();
        this.planFeatureAssembler = new PlanFeatureAssembler();
    }

    toEntity(resource) {
        return new Plan({
            id: resource.id,
            name: resource.name,
            code: resource.code,
            description: resource.description,
            price: resource.price,
            currency: resource.currency,
            billingPeriod: resource.billingPeriod,
            maxSites: resource.maxSites,
            maxDevices: resource.maxDevices,
            features: this.planFeatureAssembler.toEntities(resource.features ?? []),
            recommended: resource.recommended,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new PlanResource({
            id: entity.id,
            name: entity.name,
            code: entity.code,
            description: entity.description,
            price: entity.price,
            currency: entity.currency,
            billingPeriod: entity.billingPeriod,
            maxSites: entity.maxSites,
            maxDevices: entity.maxDevices,
            features: this.planFeatureAssembler.toResource(entity.features ?? []),
            recommended: entity.recommended,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}