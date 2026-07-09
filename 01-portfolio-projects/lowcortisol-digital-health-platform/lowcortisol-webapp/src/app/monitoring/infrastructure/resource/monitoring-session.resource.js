import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class MonitoringSessionResource extends BaseResource {
    constructor({
                    id = null,
                    siteId = "",
                    status = "active",
                    startedAt = new Date(),
                    finishedAt = null,
                    readings = [],
                    anomalies = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.status = status;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.readings = readings;
        this.anomalies = anomalies;
    }
}