import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class ConsumptionReport extends BaseEntity {
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
        this.startDate = startDate ? new Date(startDate) : null;
        this.endDate = endDate ? new Date(endDate) : null;
        this.totalWater = totalWater;
        this.totalGas = totalGas;
        this.readingsCount = readingsCount;
        this.anomaliesCount = anomaliesCount;
    }

    get periodLabel() {
        const labels = {
            daily: "Diario",
            weekly: "Semanal",
            monthly: "Mensual",
        };

        return labels[this.period] ?? "Personalizado";
    }
}
