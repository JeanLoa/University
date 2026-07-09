import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Site extends BaseEntity {
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

    activate() {
        this.status = "active";
        this.updateTimestamp();
    }

    deactivate() {
        this.status = "inactive";
        this.updateTimestamp();
    }

    putInMaintenance() {
        this.status = "maintenance";
        this.updateTimestamp();
    }

    get isActive() {
        return this.status === "active";
    }

    get typeLabel() {
        const labels = {
            residential: "Residencial",
            business: "Empresarial",
            industrial: "Industrial",
        };

        return labels[this.type] ?? "Sin clasificar";
    }

    get statusLabel() {
        const labels = {
            active: "Activa",
            inactive: "Inactiva",
            maintenance: "Mantenimiento",
        };

        return labels[this.status] ?? "Sin estado";
    }
}
