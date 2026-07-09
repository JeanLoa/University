import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SubscriptionResource extends BaseResource {
    constructor({
                    id = null,
                    userId = "",
                    workplaceId = "",
                    planId = "",
                    status = "active",
                    startedAt = new Date(),
                    expiresAt = null,
                    autoRenew = true,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.userId = userId;
        this.workplaceId = workplaceId;
        this.planId = planId;
        this.status = status;
        this.startedAt = startedAt;
        this.expiresAt = expiresAt;
        this.autoRenew = autoRenew;
    }
}