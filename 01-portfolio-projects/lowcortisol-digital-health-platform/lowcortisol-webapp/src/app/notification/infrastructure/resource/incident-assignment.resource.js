import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class IncidentAssignmentResource extends BaseResource {
    constructor({
                    id = null,
                    incidentId = "",
                    assigneeId = "",
                    assigneeName = "",
                    assignedAt = null,
                    isActive = true,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.incidentId = incidentId;
        this.assigneeId = assigneeId;
        this.assigneeName = assigneeName;
        this.assignedAt = assignedAt;
        this.isActive = Boolean(isActive);
    }
}
