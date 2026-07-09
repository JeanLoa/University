import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Subscription extends BaseEntity {
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
        this.startedAt = startedAt ? new Date(startedAt) : new Date();
        this.expiresAt = expiresAt ? new Date(expiresAt) : null;
        this.autoRenew = autoRenew;
    }

    activate() {
        this.status = "active";
        this.updateTimestamp();
    }

    cancel() {
        this.status = "cancelled";
        this.autoRenew = false;
        this.updateTimestamp();
    }

    suspend() {
        this.status = "suspended";
        this.updateTimestamp();
    }

    changePlan(planId) {
        this.planId = planId;
        this.updateTimestamp();
    }

    get isActive() {
        return this.status === "active";
    }

    get statusLabel() {
        const labels = {
            active: "Activa",
            cancelled: "Cancelada",
            suspended: "Suspendida",
            expired: "Expirada",
        };

        return labels[this.status] ?? "Sin estado";
    }
}