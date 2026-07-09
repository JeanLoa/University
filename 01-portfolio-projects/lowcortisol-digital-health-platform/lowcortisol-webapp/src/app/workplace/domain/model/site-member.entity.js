import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class SiteMember extends BaseEntity {
    constructor({
                    id = null,
                    siteId = "",
                    userId = "",
                    fullName = "",
                    email = "",
                    role = "operator",
                    status = "active",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    get roleLabel() {
        const labels = {
            owner: "Propietario",
            admin: "Administrador",
            operator: "Operador",
            viewer: "Visualizador",
        };

        return labels[this.role] ?? "Sin rol";
    }

    get isActive() {
        return this.status === "active";
    }
}