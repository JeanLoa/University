import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Sensor extends BaseEntity {
    constructor({
                    id = null,
                    deviceId = "",
                    siteId = "",
                    name = "",
                    resourceType = "water",
                    status = "active",
                    currentValue = 0,
                    unit = "L",
                    threshold = 100,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.deviceId = deviceId;
        this.siteId = siteId;
        this.name = name;
        this.resourceType = resourceType;
        this.status = status;
        this.currentValue = currentValue;
        this.unit = unit;
        this.threshold = threshold;
    }

    updateReading(value) {
        this.currentValue = value;
        this.updateTimestamp();
    }

    deactivate() {
        this.status = "inactive";
        this.updateTimestamp();
    }

    activate() {
        this.status = "active";
        this.updateTimestamp();
    }

    get isActive() {
        return this.status === "active";
    }

    get hasExceededThreshold() {
        return Number(this.currentValue) >= Number(this.threshold);
    }

    get resourceLabel() {
        const labels = {
            water: "Agua",
            gas: "Gas",
        };

        return labels[this.resourceType] ?? "Recurso";
    }
}