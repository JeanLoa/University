import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class PaymentResource extends BaseResource {
    constructor({
                    id = null,
                    subscriptionId = "",
                    amount = 0,
                    currency = "PEN",
                    method = "card",
                    status = "paid",
                    paidAt = new Date(),
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.subscriptionId = subscriptionId;
        this.amount = amount;
        this.currency = currency;
        this.method = method;
        this.status = status;
        this.paidAt = paidAt;
    }
}