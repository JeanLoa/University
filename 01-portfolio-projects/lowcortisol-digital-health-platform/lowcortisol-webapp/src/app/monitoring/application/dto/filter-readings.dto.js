export class FilterReadingsDto {
    constructor({
                    siteId = "",
                    resourceType = "all",
                    period = "7d",
                } = {}) {
        this.siteId = siteId;
        this.resourceType = resourceType;
        this.period = period;
    }

    isValid() {
        return Boolean(this.period);
    }

    toPayload() {
        return {
            siteId: this.siteId,
            resourceType: this.resourceType,
            period: this.period,
        };
    }
}