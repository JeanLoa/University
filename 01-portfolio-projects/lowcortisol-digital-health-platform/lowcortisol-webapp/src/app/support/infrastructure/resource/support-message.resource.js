import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SupportMessageResource extends BaseResource {
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
}