import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class IncidentActionResource extends BaseResource {
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
        this.performedAt = performedAt;
    }
}
