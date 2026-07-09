import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class DeviceCommandResource extends BaseResource {
    constructor({
                    id = null,
                    deviceId = "",
                    valveId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    incidentId = "",
                    commandType = "sync",
                    source = "manual",
                    reason = "",
                    requestedBy = "",
                    requestedAt = null,
                    status = "pending",
                    executedAt = null,
                    failureReason = "",
                    payload = {},
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.deviceId = deviceId;
        this.valveId = valveId;
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.incidentId = incidentId;
        this.commandType = commandType;
        this.source = source;
        this.reason = reason;
        this.requestedBy = requestedBy;
        this.requestedAt = requestedAt;
        this.status = status;
        this.executedAt = executedAt;
        this.failureReason = failureReason;
        this.payload = payload;
    }
}
