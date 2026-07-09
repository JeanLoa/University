export class SubscribeDto {
    constructor({
                    userId = "",
                    workplaceId = "",
                    planId = "",
                    paymentMethod = "card",
                } = {}) {
        this.userId = userId;
        this.workplaceId = workplaceId;
        this.planId = planId;
        this.paymentMethod = paymentMethod;
    }

    isValid() {
        return Boolean(this.userId && this.workplaceId && this.planId);
    }

    toPayload() {
        return {
            userId: this.userId,
            workplaceId: this.workplaceId,
            planId: this.planId,
            paymentMethod: this.paymentMethod,
        };
    }
}