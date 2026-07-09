import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class IncidentAssignment extends BaseEntity {
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
        this.assignedAt = assignedAt ? new Date(assignedAt) : new Date();
        this.isActive = Boolean(isActive);
    }
}
