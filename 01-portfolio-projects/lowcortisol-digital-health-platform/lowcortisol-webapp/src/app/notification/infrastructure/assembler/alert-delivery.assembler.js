import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { AlertDelivery } from "../../domain/model/alert-delivery.entity";
import { AlertDeliveryResource } from "../resource/alert-delivery.resource";
import { normalizeDate, normalizeEnum } from "./notification-field-normalizer";

export class AlertDeliveryAssembler extends BaseAssembler {
    toEntity(resource = {}) {
        return new AlertDelivery({
            id: resource.id,
            alertId: resource.alertId,
            channelId: resource.channelId,
            channelType: normalizeEnum(resource.channelType || resource.type, "in_app"),
            status: normalizeEnum(resource.status, "pending"),
            recipientUserId: resource.recipientUserId || "",
            recipientEmail: resource.recipientEmail || "",
            recipientDisplayName: resource.recipientDisplayName || "",
            messageTitle: resource.messageTitle || resource.title || "",
            messageDescription: resource.messageDescription || resource.description || "",
            attemptedAt: resource.attemptedAt || resource.createdAt,
            sentAt: resource.sentAt,
            failureReason: resource.failureReason || "",
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity = {}) {
        return new AlertDeliveryResource({
            id: entity.id,
            alertId: entity.alertId,
            channelId: entity.channelId,
            channelType: normalizeEnum(entity.channelType, "in_app"),
            status: normalizeEnum(entity.status, "pending"),
            recipientUserId: entity.recipientUserId,
            recipientEmail: entity.recipientEmail,
            recipientDisplayName: entity.recipientDisplayName,
            messageTitle: entity.messageTitle,
            messageDescription: entity.messageDescription,
            attemptedAt: normalizeDate(entity.attemptedAt),
            sentAt: normalizeDate(entity.sentAt),
            failureReason: entity.failureReason,
            createdAt: normalizeDate(entity.createdAt),
            updatedAt: normalizeDate(entity.updatedAt),
        });
    }
}
