import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class IncidentAction extends BaseEntity {
    constructor({
                    id = null,
                    incidentId = "",
                    actionType = "operator_note",
                    description = "",
                    performedBy = "",
                    performedAt = null,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.incidentId = incidentId;
        this.actionType = actionType;
        this.description = description;
        this.performedBy = performedBy;
        this.performedAt = performedAt ? new Date(performedAt) : new Date();
    }
}
