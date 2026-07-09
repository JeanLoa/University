import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SupportTicketResource extends BaseResource {
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
}