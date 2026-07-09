import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Incident extends BaseEntity {
    constructor({
                    id = null,
                    alertId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    deviceId = "",
                    sensorId = "",
                    title = "",
                    description = "",
                    priority = "medium",
                    status = "open",
                    assignedTo = "",
                    actions = [],
                    assignments = [],
                    resolvedAt = null,
                    closedAt = null,
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
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.assignedTo = assignedTo;
        this.actions = actions;
        this.assignments = assignments;
        this.resolvedAt = resolvedAt ? new Date(resolvedAt) : null;
        this.closedAt = closedAt ? new Date(closedAt) : null;
    }

    assignTo(assigneeName) {
        this.assignedTo = assigneeName;
        this.status = "assigned";
        this.updateTimestamp();
    }

    markInProgress() {
        this.status = "in_progress";
        this.updateTimestamp();
    }

    resolve() {
        this.status = "resolved";
        this.resolvedAt = new Date();
        this.updateTimestamp();
    }

    close() {
        this.status = "closed";
        this.closedAt = new Date();
        this.updateTimestamp();
    }

    get activeAssignment() {
        return this.assignments.find((assignment) => assignment.isActive) || null;
    }
}
