import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class SupportAgent extends BaseEntity {
    constructor({
                    id = null,
                    fullName = "",
                    email = "",
                    specialty = "technical",
                    status = "available",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.fullName = fullName;
        this.email = email;
        this.specialty = specialty;
        this.status = status;
    }

    setAvailable() {
        this.status = "available";
        this.updateTimestamp();
    }

    setBusy() {
        this.status = "busy";
        this.updateTimestamp();
    }

    get statusLabel() {
        const labels = {
            available: "Disponible",
            busy: "Ocupado",
            offline: "Desconectado",
        };

        return labels[this.status] ?? "Sin estado";
    }

    get specialtyLabel() {
        const labels = {
            technical: "Técnico",
            billing: "Facturación",
            devices: "Dispositivos",
            incidents: "Incidentes",
        };

        return labels[this.specialty] ?? "Soporte";
    }
}