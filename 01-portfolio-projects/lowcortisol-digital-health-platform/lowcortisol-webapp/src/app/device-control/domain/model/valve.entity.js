import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Valve extends BaseEntity {
    constructor({
                    id = null,
                    deviceId = "",
                    siteId = "",
                    name = "",
                    resourceType = "gas",
                    status = "open",
                    openingPercentage = 100,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.deviceId = deviceId;
        this.siteId = siteId;
        this.name = name;
        this.resourceType = resourceType;
        this.status = status;
        this.openingPercentage = openingPercentage;
    }

    open() {
        this.status = "open";
        this.openingPercentage = 100;
        this.updateTimestamp();
    }

    close() {
        this.status = "closed";
        this.openingPercentage = 0;
        this.updateTimestamp();
    }

    setOpeningPercentage(value) {
        const percentage = Math.max(0, Math.min(100, Number(value)));

        this.openingPercentage = percentage;
        this.status = percentage === 0 ? "closed" : "open";
        this.updateTimestamp();
    }

    get isOpen() {
        return this.status === "open";
    }

    get resourceLabel() {
        const labels = {
            water: "Agua",
            gas: "Gas",
        };

        return labels[this.resourceType] ?? "Recurso";
    }

    get statusLabel() {
        const labels = {
            open: "Abierta",
            closed: "Cerrada",
            maintenance: "Mantenimiento",
        };

        return labels[this.status] ?? "Sin estado";
    }
}