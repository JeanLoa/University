import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { SupportTicket } from "../../domain/model/support-ticket.entity";
import { SupportTicketResource } from "../resource/support-ticket.resource";
import { SupportMessageAssembler } from "./support-message.assembler";

export class SupportTicketAssembler extends BaseAssembler {
    constructor() {
        super();
        this.supportMessageAssembler = new SupportMessageAssembler();
    }

    toEntity(resource) {
        return new SupportTicket({
            id: resource.id,
            userId: resource.userId,
            siteId: resource.siteId,
            title: resource.title,
            description: resource.description,
            category: resource.category,
            priority: resource.priority,
            status: resource.status,
            assignedAgentId: resource.assignedAgentId,
            messages: this.supportMessageAssembler.toEntities(resource.messages ?? []),
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SupportTicketResource({
            id: entity.id,
            userId: entity.userId,
            siteId: entity.siteId,
            title: entity.title,
            description: entity.description,
            category: entity.category,
            priority: entity.priority,
            status: entity.status,
            assignedAgentId: entity.assignedAgentId,
            messages: this.supportMessageAssembler.toResource(entity.messages ?? []),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}