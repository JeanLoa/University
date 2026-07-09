import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class ThresholdResource extends BaseResource {
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
}