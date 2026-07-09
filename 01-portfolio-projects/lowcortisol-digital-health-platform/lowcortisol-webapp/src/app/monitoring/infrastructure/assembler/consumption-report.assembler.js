import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { ConsumptionReport } from "../../domain/model/consumption-report.entity";
import { ConsumptionReportResource } from "../resource/consumption-report.resource";

export class ConsumptionReportAssembler extends BaseAssembler {
    toEntity(resource) {
        return new ConsumptionReport({
            id: resource.id,
            title: resource.title,
            siteId: resource.siteId,
            period: resource.period,
            startDate: resource.startDate,
            endDate: resource.endDate,
            totalWater: resource.totalWater,
            totalGas: resource.totalGas,
            readingsCount: resource.readingsCount,
            anomaliesCount: resource.anomaliesCount,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new ConsumptionReportResource({
            id: entity.id,
            title: entity.title,
            siteId: entity.siteId,
            period: entity.period,
            startDate: entity.startDate,
            endDate: entity.endDate,
            totalWater: entity.totalWater,
            totalGas: entity.totalGas,
            readingsCount: entity.readingsCount,
            anomaliesCount: entity.anomaliesCount,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}
