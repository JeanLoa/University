import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class ValveOperationResource extends BaseResource {
    constructor({
                    id = null,
                    valveId = "",
                    deviceId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    incidentId = "",
                    resourceType = "water",
                    previousStatus = "",
                    targetStatus = "closed",
                    reason = "",
                    source = "manual",
                    status = "executed",
                    requestedAt = null,
                    completedAt = null,
                    failureReason = "",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.valveId = valveId;
        this.deviceId = deviceId;
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.incidentId = incidentId;
        this.resourceType = resourceType;
        this.previousStatus = previousStatus;
        this.targetStatus = targetStatus;
        this.reason = reason;
        this.source = source;
        this.status = status;
        this.requestedAt = requestedAt;
        this.completedAt = completedAt;
        this.failureReason = failureReason;
    }
}
