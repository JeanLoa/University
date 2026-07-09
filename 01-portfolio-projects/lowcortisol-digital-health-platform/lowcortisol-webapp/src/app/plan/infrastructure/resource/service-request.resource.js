import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class ServiceRequestResource extends BaseResource {
    constructor({
                    id = null,
                    subscriptionId = "",
                    type = "change-plan",
                    description = "",
                    status = "open",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.subscriptionId = subscriptionId;
        this.type = type;
        this.description = description;
        this.status = status;
    }
}