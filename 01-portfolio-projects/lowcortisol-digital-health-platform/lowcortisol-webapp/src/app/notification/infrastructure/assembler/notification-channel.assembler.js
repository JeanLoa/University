import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { NotificationChannel } from "../../domain/model/notification-channel.entity";
import { NotificationChannelResource } from "../resource/notification-channel.resource";
import { normalizeBoolean, normalizeDate, normalizeEnum } from "./notification-field-normalizer";

export class NotificationChannelAssembler extends BaseAssembler {
    toEntity(resource = {}) {
        return new NotificationChannel({
            id: resource.id,
            name: resource.name,
            type: normalizeEnum(resource.type, "in_app"),
            destination: resource.destination || "",
            isActive: normalizeBoolean(resource.isActive, resource.enabled ?? true),
            enabled: resource.enabled ?? null,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity = {}) {
        return new NotificationChannelResource({
            id: entity.id,
            name: entity.name,
            type: normalizeEnum(entity.type, "in_app"),
            destination: entity.destination,
            isActive: normalizeBoolean(entity.isActive, true),
            createdAt: normalizeDate(entity.createdAt),
            updatedAt: normalizeDate(entity.updatedAt),
        });
    }
}
