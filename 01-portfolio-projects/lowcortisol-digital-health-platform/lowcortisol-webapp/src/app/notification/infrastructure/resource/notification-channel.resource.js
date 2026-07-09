import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class NotificationChannelResource extends BaseResource {
    constructor({
                    id = null,
                    name = "",
                    type = "in_app",
                    destination = "",
                    isActive = true,
                    enabled = null,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.name = name;
        this.type = type;
        this.destination = destination;
        this.isActive = enabled === null ? Boolean(isActive) : Boolean(enabled);
    }
}
