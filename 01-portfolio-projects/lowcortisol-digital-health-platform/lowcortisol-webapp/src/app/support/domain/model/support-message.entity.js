import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class SupportMessage extends BaseEntity {
    constructor({
                    id = null,
                    ticketId = "",
                    senderId = "",
                    senderType = "user",
                    content = "",
                    status = "sent",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.ticketId = ticketId;
        this.senderId = senderId;
        this.senderType = senderType;
        this.content = content;
        this.status = status;
    }

    markAsRead() {
        this.status = "read";
        this.updateTimestamp();
    }

    get senderTypeLabel() {
        const labels = {
            user: "Usuario",
            agent: "Agente",
            system: "Sistema",
        };

        return labels[this.senderType] ?? "Remitente";
    }
}