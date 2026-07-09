export class UpdateAlertDto {
    constructor({
                    alertId = "",
                    status = "resolved",
                } = {}) {
        this.alertId = alertId;
        this.status = status;
    }

    isValid() {
        return Boolean(this.alertId && this.status);
    }

    toPayload() {
        return {
            alertId: this.alertId,
            status: this.status,
        };
    }
}