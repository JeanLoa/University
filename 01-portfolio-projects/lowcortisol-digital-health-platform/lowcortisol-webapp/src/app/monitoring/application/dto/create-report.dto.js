export class CreateReportDto {
    constructor({
                    siteId = "",
                    period = "monthly",
                    startDate = null,
                    endDate = null,
                } = {}) {
        this.siteId = siteId;
        this.period = period;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    isValid() {
        return Boolean(this.siteId && this.period);
    }

    toPayload() {
        return {
            siteId: this.siteId,
            period: this.period,
            startDate: this.startDate,
            endDate: this.endDate,
        };
    }
}