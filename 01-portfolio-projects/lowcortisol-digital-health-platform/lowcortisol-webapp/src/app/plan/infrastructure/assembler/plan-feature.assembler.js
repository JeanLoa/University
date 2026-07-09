import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { PlanFeature } from "../../domain/model/plan-feature.entity";
import { PlanFeatureResource } from "../resource/plan-feature.resource";

export class PlanFeatureAssembler extends BaseAssembler {
    toEntity(resource) {
        return new PlanFeature({
            id: resource.id,
            planId: resource.planId,
            name: resource.name,
            description: resource.description,
            included: resource.included,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new PlanFeatureResource({
            id: entity.id,
            planId: entity.planId,
            name: entity.name,
            description: entity.description,
            included: entity.included,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}