import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { SupportConversation } from "../../domain/model/support-conversation.entity";
import { SupportConversationResource } from "../resource/support-conversation.resource";
import { SupportMessageAssembler } from "./support-message.assembler";

export class SupportConversationAssembler extends BaseAssembler {
    constructor() {
        super();
        this.supportMessageAssembler = new SupportMessageAssembler();
    }

    toEntity(resource) {
        return new SupportConversation({
            id: resource.id,
            ticketId: resource.ticketId,
            messages: this.supportMessageAssembler.toEntities(resource.messages ?? []),
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SupportConversationResource({
            id: entity.id,
            ticketId: entity.ticketId,
            messages: this.supportMessageAssembler.toResource(entity.messages ?? []),
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}