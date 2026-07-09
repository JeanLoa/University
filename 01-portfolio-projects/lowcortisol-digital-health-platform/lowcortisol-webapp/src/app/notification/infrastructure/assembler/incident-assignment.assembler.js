import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { IncidentAssignment } from "../../domain/model/incident-assignment.entity";
import { IncidentAssignmentResource } from "../resource/incident-assignment.resource";
import { normalizeBoolean, normalizeDate } from "./notification-field-normalizer";

export class IncidentAssignmentAssembler extends BaseAssembler {
    toEntity(resource = {}) {
        return new IncidentAssignment({
            id: resource.id,
            incidentId: resource.incidentId,
            assigneeId: resource.assigneeId || "",
            assigneeName: resource.assigneeName || resource.assignedTo || "",
            assignedAt: resource.assignedAt || resource.createdAt,
            isActive: normalizeBoolean(resource.isActive, true),
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity = {}) {
        return new IncidentAssignmentResource({
            id: entity.id,
            incidentId: entity.incidentId,
            assigneeId: entity.assigneeId,
            assigneeName: entity.assigneeName,
            assignedAt: normalizeDate(entity.assignedAt),
            isActive: normalizeBoolean(entity.isActive, true),
            createdAt: normalizeDate(entity.createdAt),
            updatedAt: normalizeDate(entity.updatedAt),
        });
    }
}
