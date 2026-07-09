import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class MonitoringSession extends BaseEntity {
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
        this.startedAt = startedAt ? new Date(startedAt) : new Date();
        this.finishedAt = finishedAt ? new Date(finishedAt) : null;
        this.readings = readings;
        this.anomalies = anomalies;
    }

    addReading(reading) {
        this.readings.push(reading);
        this.updateTimestamp();
    }

    addAnomaly(anomaly) {
        this.anomalies.push(anomaly);
        this.updateTimestamp();
    }

    finish() {
        this.status = "finished";
        this.finishedAt = new Date();
        this.updateTimestamp();
    }

    get isActive() {
        return this.status === "active";
    }

    get totalReadings() {
        return this.readings.length;
    }

    get totalAnomalies() {
        return this.anomalies.length;
    }
}