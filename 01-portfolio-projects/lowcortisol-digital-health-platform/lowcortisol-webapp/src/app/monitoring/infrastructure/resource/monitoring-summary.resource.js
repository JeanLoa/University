import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class MonitoringSummaryResource extends BaseResource {
    constructor({
                    id = null,
                    totalWater = 0,
                    totalGas = 0,
                    waterConsumptionTotal = null,
                    gasConsumptionTotal = null,
                    totalReadings = 0,
                    openAnomalies = 0,
                    activeThresholds = 0,
                    monitoredSensors = 0,
                    latestReadingDate = null,
                    activeSensors = 0,
                    activeSessions = 0,
                    criticalAnomalies = 0,
                    reportsGenerated = 0,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.totalWater = waterConsumptionTotal ?? totalWater;
        this.totalGas = gasConsumptionTotal ?? totalGas;
        this.waterConsumptionTotal = this.totalWater;
        this.gasConsumptionTotal = this.totalGas;
        this.totalReadings = Number(totalReadings || 0);
        this.openAnomalies = Number(openAnomalies || 0);
        this.activeThresholds = Number(activeThresholds || 0);
        this.monitoredSensors = Number(monitoredSensors || activeSensors || 0);
        this.latestReadingDate = latestReadingDate;
        this.activeSensors = Number(activeSensors || monitoredSensors || 0);
        this.activeSessions = Number(activeSessions || 0);
        this.criticalAnomalies = Number(criticalAnomalies || 0);
        this.reportsGenerated = Number(reportsGenerated || 0);
    }
}
