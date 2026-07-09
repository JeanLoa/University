import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class User extends BaseEntity {
    constructor({
                    id = null,
                    fullName = "",
                    email = "",
                    phone = "",
                    status = "active",
                    accessProfileId = "",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.accessProfileId = accessProfileId;
    }

    updateProfile({ fullName, phone }) {
        this.fullName = fullName ?? this.fullName;
        this.phone = phone ?? this.phone;
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

    get initials() {
        return this.fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("");
    }

    get statusLabel() {
        const labels = {
            active: "Activo",
            inactive: "Inactivo",
            pending: "Pendiente",
        };

        return labels[this.status] ?? "Sin estado";
    }
}