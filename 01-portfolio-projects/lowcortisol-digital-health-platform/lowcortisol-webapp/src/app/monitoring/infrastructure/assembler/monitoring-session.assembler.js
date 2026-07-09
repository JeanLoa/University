import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { MonitoringSession } from "../../domain/model/monitoring-session.entity";
import { MonitoringSessionResource } from "../resource/monitoring-session.resource";
import { ConsumptionReadingAssembler } from "./consumption-reading.assembler";
import { AnomalyAssembler } from "./anomaly.assembler";

export class MonitoringSessionAssembler extends BaseAssembler {
    constructor() {
        super();

        this.readingAssembler = new ConsumptionReadingAssembler();
        this.anomalyAssembler = new AnomalyAssembler();
    }

    toEntity(resource) {
        return new MonitoringSession({
            id: resource.id,
            siteId: resource.siteId,
            status: resource.status,
            startedAt: resource.startedAt,
            finishedAt: resource.finishedAt,
            readings: this.readingAssembler.toEntities(resource.readings ?? []),
            anomalies: this.anomalyAssembler.toEntities(resource.anomalies ?? []),
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new MonitoringSessionResource({
            id: entity.id,
            siteId: entity.siteId,
            status: entity.status,
            startedAt: entity.startedAt,
            finishedAt: entity.finishedAt,
            readings: this.readingAssembler.toResource(entity.readings ?? []),
            anomalies: this.anomalyAssembler.toResource(entity.anomalies ?? []),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}