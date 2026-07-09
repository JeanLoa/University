import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SupportConversationResource extends BaseResource {
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
}