import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Alert extends BaseEntity {
    constructor({
                    id = null,
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    deviceId = "",
                    sensorId = "",
                    anomalyId = "",
                    readingId = "",
                    resourceType = "water",
                    sourceType = "threshold",
                    title = "",
                    description = "",
                    severity = "warning",
                    status = "open",
                    minutesToAcknowledge = 0,
                    minutesToResolve = 0,
                    acknowledgedAt = null,
                    resolvedAt = null,
                    closedAt = null,
                    deliveries = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.deviceId = deviceId;
        this.sensorId = sensorId;
        this.anomalyId = anomalyId;
        this.readingId = readingId;
        this.resourceType = resourceType;
        this.sourceType = sourceType;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.minutesToAcknowledge = Number(minutesToAcknowledge || 0);
        this.minutesToResolve = Number(minutesToResolve || 0);
        this.acknowledgedAt = acknowledgedAt ? new Date(acknowledgedAt) : null;
        this.resolvedAt = resolvedAt ? new Date(resolvedAt) : null;
        this.closedAt = closedAt ? new Date(closedAt) : null;
        this.deliveries = deliveries;
    }

    acknowledge() {
        this.status = "acknowledged";
        this.acknowledgedAt = new Date();
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

    get isOpen() {
        return ["open", "acknowledged"].includes(this.status);
    }
}
