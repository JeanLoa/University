import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { SubscriptionAssembler } from "../assembler/subscription.assembler";

export class SubscriptionsApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/subscriptions", new SubscriptionAssembler());
    }

    async getActiveSubscription() {
        const response = await this.getFromPath("/active");
        const resource = response?.data ?? response;

        return this.assembler.toEntity(resource);
    }

    async cancelSubscription(subscriptionId) {
        const response = await this.postToPath(`/${subscriptionId}/cancel`);
        const resource = response?.data ?? response;

        return this.assembler.toEntity(resource);
    }
}