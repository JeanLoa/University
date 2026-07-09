import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Payment extends BaseEntity {
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
        this.paidAt = paidAt ? new Date(paidAt) : new Date();
    }

    markAsPaid() {
        this.status = "paid";
        this.paidAt = new Date();
        this.updateTimestamp();
    }

    markAsFailed() {
        this.status = "failed";
        this.updateTimestamp();
    }

    get amountLabel() {
        return `S/ ${Number(this.amount).toFixed(2)}`;
    }

    get statusLabel() {
        const labels = {
            paid: "Pagado",
            pending: "Pendiente",
            failed: "Fallido",
            refunded: "Reembolsado",
        };

        return labels[this.status] ?? "Sin estado";
    }
}