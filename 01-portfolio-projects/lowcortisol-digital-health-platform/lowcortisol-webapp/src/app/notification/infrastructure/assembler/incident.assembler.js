import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Incident } from "../../domain/model/incident.entity";
import { IncidentResource } from "../resource/incident.resource";
import { IncidentActionAssembler } from "./incident-action.assembler";
import { IncidentAssignmentAssembler } from "./incident-assignment.assembler";
import { normalizeDate, normalizeEnum } from "./notification-field-normalizer";

const actionAssembler = new IncidentActionAssembler();
const assignmentAssembler = new IncidentAssignmentAssembler();

function resolveAssignedTo(resource = {}) {
    if (resource.assignedTo) return resource.assignedTo;

    const activeAssignment = (resource.assignments || []).find((assignment) => assignment.isActive);
    return activeAssignment?.assigneeName || "";
}

export class IncidentAssembler extends BaseAssembler {
    toEntity(resource = {}) {
        const actions = Array.isArray(resource.actions)
            ? resource.actions.map((action) => actionAssembler.toEntity(action))
            : [];
        const assignments = Array.isArray(resource.assignments)
            ? resource.assignments.map((assignment) => assignmentAssembler.toEntity(assignment))
            : [];

        return new Incident({
            id: resource.id,
            alertId: resource.alertId,
            siteId: resource.siteId,
            roomId: resource.roomId,
            deviceGroupId: resource.deviceGroupId,
            deviceId: resource.deviceId,
            sensorId: resource.sensorId,
            priority: normalizeEnum(resource.priority, "medium"),
            status: normalizeEnum(resource.status, "open"),
            title: resource.title,
            description: resource.description,
            assignedTo: resolveAssignedTo(resource),
            resolvedAt: resource.resolvedAt,
            closedAt: resource.closedAt,
            actions,
            assignments,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity = {}) {
        return new IncidentResource({
            id: entity.id,
            alertId: entity.alertId,
            siteId: entity.siteId,
            roomId: entity.roomId,
            deviceGroupId: entity.deviceGroupId,
            deviceId: entity.deviceId,
            sensorId: entity.sensorId,
            priority: normalizeEnum(entity.priority, "medium"),
            status: normalizeEnum(entity.status, "open"),
            title: entity.title,
            description: entity.description,
            assignedTo: entity.assignedTo,
            resolvedAt: normalizeDate(entity.resolvedAt),
            closedAt: normalizeDate(entity.closedAt),
            actions: (entity.actions || []).map((action) => actionAssembler.toResource(action)),
            assignments: (entity.assignments || []).map((assignment) => assignmentAssembler.toResource(assignment)),
            createdAt: normalizeDate(entity.createdAt),
            updatedAt: normalizeDate(entity.updatedAt),
        });
    }
}
