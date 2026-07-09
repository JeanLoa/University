export class UpdateValveStatusDto {
    constructor({
                    valveId = "",
                    status = "closed",
                    openingPercentage = 0,
                } = {}) {
        this.valveId = valveId;
        this.status = status;
        this.openingPercentage = openingPercentage;
    }

    isValid() {
        return Boolean(this.valveId && this.status);
    }

    toPayload() {
        return {
            valveId: this.valveId,
            status: this.status,
            openingPercentage: this.openingPercentage,
        };
    }
}