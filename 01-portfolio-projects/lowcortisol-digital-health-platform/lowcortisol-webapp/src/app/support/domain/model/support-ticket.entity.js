import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class SupportTicket extends BaseEntity {
    constructor({
                    id = null,
                    userId = "",
                    siteId = "",
                    title = "",
                    description = "",
                    category = "technical",
                    priority = "medium",
                    status = "open",
                    assignedAgentId = "",
                    messages = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.userId = userId;
        this.siteId = siteId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.assignedAgentId = assignedAgentId;
        this.messages = messages;
    }

    assignTo(agentId) {
        this.assignedAgentId = agentId;
        this.status = "assigned";
        this.updateTimestamp();
    }

    addMessage(message) {
        this.messages.push(message);
        this.updateTimestamp();
    }

    resolve() {
        this.status = "resolved";
        this.updateTimestamp();
    }

    close() {
        this.status = "closed";
        this.updateTimestamp();
    }

    get statusLabel() {
        const labels = {
            open: "Abierto",
            assigned: "Asignado",
            resolved: "Resuelto",
            closed: "Cerrado",
        };

        return labels[this.status] ?? "Sin estado";
    }

    get priorityLabel() {
        const labels = {
            low: "Baja",
            medium: "Media",
            high: "Alta",
            critical: "Crítica",
        };

        return labels[this.priority] ?? "Sin prioridad";
    }

    get categoryLabel() {
        const labels = {
            technical: "Técnico",
            billing: "Facturación",
            device: "Dispositivos",
            incident: "Incidente",
        };

        return labels[this.category] ?? "Soporte";
    }
}
