export class ChangePlanDto {
    constructor({
                    subscriptionId = "",
                    newPlanId = "",
                } = {}) {
        this.subscriptionId = subscriptionId;
        this.newPlanId = newPlanId;
    }

    isValid() {
        return Boolean(this.subscriptionId && this.newPlanId);
    }

    toPayload() {
        return {
            subscriptionId: this.subscriptionId,
            newPlanId: this.newPlanId,
        };
    }
}