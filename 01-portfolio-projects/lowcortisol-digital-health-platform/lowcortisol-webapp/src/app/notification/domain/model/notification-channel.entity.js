import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class NotificationChannel extends BaseEntity {
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

    enable() {
        this.isActive = true;
        this.updateTimestamp();
    }

    disable() {
        this.isActive = false;
        this.updateTimestamp();
    }

    get enabled() {
        return this.isActive;
    }
}
