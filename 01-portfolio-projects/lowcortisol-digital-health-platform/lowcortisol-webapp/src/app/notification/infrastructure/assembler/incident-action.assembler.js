import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { IncidentAction } from "../../domain/model/incident-action.entity";
import { IncidentActionResource } from "../resource/incident-action.resource";
import { normalizeDate, normalizeEnum } from "./notification-field-normalizer";

export class IncidentActionAssembler extends BaseAssembler {
    toEntity(resource = {}) {
        return new IncidentAction({
            id: resource.id,
            incidentId: resource.incidentId,
            actionType: normalizeEnum(resource.actionType, "operator_note"),
            description: resource.description || "",
            performedBy: resource.performedBy || "",
            performedAt: resource.performedAt || resource.createdAt,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity = {}) {
        return new IncidentActionResource({
            id: entity.id,
            incidentId: entity.incidentId,
            actionType: normalizeEnum(entity.actionType, "operator_note"),
            description: entity.description,
            performedBy: entity.performedBy,
            performedAt: normalizeDate(entity.performedAt),
            createdAt: normalizeDate(entity.createdAt),
            updatedAt: normalizeDate(entity.updatedAt),
        });
    }
}
