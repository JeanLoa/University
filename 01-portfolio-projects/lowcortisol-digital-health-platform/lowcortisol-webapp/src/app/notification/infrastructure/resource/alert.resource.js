import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class AlertResource extends BaseResource {
    constructor({
                    id = null,
                    title = "",
                    description = "",
                    severity = "warning",
                    status = "open",
                    sourceType = "threshold",
                    anomalyId = "",
                    readingId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    deviceId = "",
                    sensorId = "",
                    resourceType = "water",
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

        this.title = title;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.sourceType = sourceType;
        this.anomalyId = anomalyId;
        this.readingId = readingId;
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.deviceId = deviceId;
        this.sensorId = sensorId;
        this.resourceType = resourceType;
        this.minutesToAcknowledge = minutesToAcknowledge;
        this.minutesToResolve = minutesToResolve;
        this.acknowledgedAt = acknowledgedAt;
        this.resolvedAt = resolvedAt;
        this.closedAt = closedAt;
        this.deliveries = deliveries;
    }
}
