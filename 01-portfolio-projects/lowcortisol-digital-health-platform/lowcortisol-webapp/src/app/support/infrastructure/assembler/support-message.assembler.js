import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { SupportMessage } from "../../domain/model/support-message.entity";
import { SupportMessageResource } from "../resource/support-message.resource";

export class SupportMessageAssembler extends BaseAssembler {
    toEntity(resource) {
        return new SupportMessage({
            id: resource.id,
            ticketId: resource.ticketId,
            senderId: resource.senderId,
            senderType: resource.senderType,
            content: resource.content,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SupportMessageResource({
            id: entity.id,
            ticketId: entity.ticketId,
            senderId: entity.senderId,
            senderType: entity.senderType,
            content: entity.content,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}