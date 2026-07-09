import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class ServiceRequest extends BaseEntity {
    constructor({
                    id = null,
                    subscriptionId = "",
                    type = "change-plan",
                    description = "",
                    status = "open",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.subscriptionId = subscriptionId;
        this.type = type;
        this.description = description;
        this.status = status;
    }

    resolve() {
        this.status = "resolved";
        this.updateTimestamp();
    }

    close() {
        this.status = "closed";
        this.updateTimestamp();
    }

    get typeLabel() {
        const labels = {
            "change-plan": "Cambio de plan",
            cancellation: "Cancelación",
            support: "Soporte",
        };

        return labels[this.type] ?? "Solicitud";
    }

    get statusLabel() {
        const labels = {
            open: "Abierta",
            resolved: "Resuelta",
            closed: "Cerrada",
        };

        return labels[this.status] ?? "Sin estado";
    }
}