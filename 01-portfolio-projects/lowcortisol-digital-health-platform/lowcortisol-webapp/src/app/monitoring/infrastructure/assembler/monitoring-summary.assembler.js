import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { MonitoringSummary } from "../../domain/model/monitoring-summary.entity";
import { MonitoringSummaryResource } from "../resource/monitoring-summary.resource";

export class MonitoringSummaryAssembler extends BaseAssembler {
    toEntity(resource) {
        return new MonitoringSummary({
            id: resource.id,
            totalWater: resource.totalWater,
            totalGas: resource.totalGas,
            waterConsumptionTotal: resource.waterConsumptionTotal,
            gasConsumptionTotal: resource.gasConsumptionTotal,
            totalReadings: resource.totalReadings,
            openAnomalies: resource.openAnomalies,
            activeThresholds: resource.activeThresholds,
            monitoredSensors: resource.monitoredSensors,
            latestReadingDate: resource.latestReadingDate,
            activeSensors: resource.activeSensors,
            activeSessions: resource.activeSessions,
            criticalAnomalies: resource.criticalAnomalies,
            reportsGenerated: resource.reportsGenerated,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new MonitoringSummaryResource({
            id: entity.id,
            totalWater: entity.totalWater,
            totalGas: entity.totalGas,
            waterConsumptionTotal: entity.waterConsumptionTotal,
            gasConsumptionTotal: entity.gasConsumptionTotal,
            totalReadings: entity.totalReadings,
            openAnomalies: entity.openAnomalies,
            activeThresholds: entity.activeThresholds,
            monitoredSensors: entity.monitoredSensors,
            latestReadingDate: entity.latestReadingDate,
            activeSensors: entity.activeSensors,
            activeSessions: entity.activeSessions,
            criticalAnomalies: entity.criticalAnomalies,
            reportsGenerated: entity.reportsGenerated,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
