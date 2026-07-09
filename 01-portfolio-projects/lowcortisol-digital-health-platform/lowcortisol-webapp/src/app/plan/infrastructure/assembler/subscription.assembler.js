import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Subscription } from "../../domain/model/subscription.entity";
import { SubscriptionResource } from "../resource/subscription.resource";

export class SubscriptionAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Subscription({
            id: resource.id,
            userId: resource.userId,
            workplaceId: resource.workplaceId,
            planId: resource.planId,
            status: resource.status,
            startedAt: resource.startedAt,
            expiresAt: resource.expiresAt,
            autoRenew: resource.autoRenew,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SubscriptionResource({
            id: entity.id,
            userId: entity.userId,
            workplaceId: entity.workplaceId,
            planId: entity.planId,
            status: entity.status,
            startedAt: entity.startedAt,
            expiresAt: entity.expiresAt,
            autoRenew: entity.autoRenew,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}