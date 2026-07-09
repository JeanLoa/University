import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Threshold extends BaseEntity {
    constructor({
                    id = null,
                    siteId = "",
                    sensorId = "",
                    resourceType = "water",
                    warningLimit = 250,
                    criticalLimit = 320,
                    unit = "L",
                    enabled = true,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.warningLimit = warningLimit;
        this.criticalLimit = criticalLimit;
        this.unit = unit;
        this.enabled = enabled;
    }

    disable() {
        this.enabled = false;
        this.updateTimestamp();
    }

    enable() {
        this.enabled = true;
        this.updateTimestamp();
    }

    evaluate(value) {
        if (!this.enabled) return "disabled";
        if (value >= this.criticalLimit) return "critical";
        if (value >= this.warningLimit) return "warning";

        return "normal";
    }

    get resourceLabel() {
        const labels = {
            water: "Agua",
            gas: "Gas",
        };

        return labels[this.resourceType] ?? "Recurso";
    }
}