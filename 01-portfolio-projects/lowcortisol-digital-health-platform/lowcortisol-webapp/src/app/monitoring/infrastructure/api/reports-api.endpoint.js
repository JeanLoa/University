import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { ConsumptionReportAssembler } from "../assembler/consumption-report.assembler";

export class ReportsApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/reports", new ConsumptionReportAssembler());
    }

    async getReportsBySite(siteId) {
        const response = await this.getFromPath(`?siteId=${siteId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }
}