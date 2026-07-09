import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class IncidentResource extends BaseResource {
    constructor({
                    id = null,
                    alertId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    deviceId = "",
                    sensorId = "",
                    priority = "medium",
                    status = "open",
                    title = "",
                    description = "",
                    assignedTo = "",
                    resolvedAt = null,
                    closedAt = null,
                    actions = [],
                    assignments = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.alertId = alertId;
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.deviceId = deviceId;
        this.sensorId = sensorId;
        this.priority = priority;
        this.status = status;
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.resolvedAt = resolvedAt;
        this.closedAt = closedAt;
        this.actions = actions;
        this.assignments = assignments;
    }
}
