import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class ConsumptionReportResource extends BaseResource {
    constructor({
                    id = null,
                    title = "",
                    siteId = "",
                    period = "monthly",
                    startDate = null,
                    endDate = null,
                    totalWater = 0,
                    totalGas = 0,
                    readingsCount = 0,
                    anomaliesCount = 0,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.title = title;
        this.siteId = siteId;
        this.period = period;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalWater = totalWater;
        this.totalGas = totalGas;
        this.readingsCount = readingsCount;
        this.anomaliesCount = anomaliesCount;
    }
}
