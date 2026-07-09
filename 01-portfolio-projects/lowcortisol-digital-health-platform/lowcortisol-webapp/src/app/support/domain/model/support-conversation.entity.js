import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class SupportConversation extends BaseEntity {
    constructor({
                    id = null,
                    ticketId = "",
                    messages = [],
                    status = "active",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.ticketId = ticketId;
        this.messages = messages;
        this.status = status;
    }

    addMessage(message) {
        this.messages.push(message);
        this.updateTimestamp();
    }

    close() {
        this.status = "closed";
        this.updateTimestamp();
    }

    get totalMessages() {
        return this.messages.length;
    }

    get isActive() {
        return this.status === "active";
    }
}