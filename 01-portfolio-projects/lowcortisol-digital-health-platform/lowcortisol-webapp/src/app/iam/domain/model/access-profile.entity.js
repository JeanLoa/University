import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class AccessProfile extends BaseEntity {
    constructor({
                    id = null,
                    name = "",
                    role = "owner",
                    permissions = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.name = name;
        this.role = role;
        this.permissions = permissions;
    }

    hasPermission(permission) {
        return this.permissions.includes(permission);
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
}