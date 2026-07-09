export class ProcessPaymentDto {
    constructor({
                    subscriptionId = "",
                    amount = 0,
                    currency = "PEN",
                    method = "card",
                } = {}) {
        this.subscriptionId = subscriptionId;
        this.amount = amount;
        this.currency = currency;
        this.method = method;
    }

    isValid() {
        return Boolean(this.subscriptionId && Number(this.amount) >= 0);
    }

    toPayload() {
        return {
            subscriptionId: this.subscriptionId,
            amount: this.amount,
            currency: this.currency,
            method: this.method,
        };
    }
}