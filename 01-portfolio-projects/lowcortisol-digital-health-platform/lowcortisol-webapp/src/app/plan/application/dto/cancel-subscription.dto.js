export class CancelSubscriptionDto {
    constructor({
                    subscriptionId = "",
                    reason = "",
                } = {}) {
        this.subscriptionId = subscriptionId;
        this.reason = reason.trim();
    }

    isValid() {
        return Boolean(this.subscriptionId);
    }

    toPayload() {
        return {
            subscriptionId: this.subscriptionId,
            reason: this.reason,
        };
    }
}