export class UpdateSupportTicketDto {
    constructor({
                    ticketId = "",
                    status = "resolved",
                } = {}) {
        this.ticketId = ticketId;
        this.status = status;
    }

    isValid() {
        return Boolean(this.ticketId && this.status);
    }

    toPayload() {
        return {
            ticketId: this.ticketId,
            status: this.status,
        };
    }
}