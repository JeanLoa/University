import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SiteResource extends BaseResource {
    constructor({
                    id = null,
                    workplaceId = "",
                    name = "",
                    address = "",
                    type = "residential",
                    status = "active",
                    waterConsumption = 0,
                    gasConsumption = 0,
                    activeSensors = 0,
                    activeIncidents = 0,
                    latitude = null,
                    longitude = null,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.workplaceId = workplaceId;
        this.name = name;
        this.address = address;
        this.type = type;
        this.status = status;
        this.waterConsumption = waterConsumption;
        this.gasConsumption = gasConsumption;
        this.activeSensors = activeSensors;
        this.activeIncidents = activeIncidents;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
