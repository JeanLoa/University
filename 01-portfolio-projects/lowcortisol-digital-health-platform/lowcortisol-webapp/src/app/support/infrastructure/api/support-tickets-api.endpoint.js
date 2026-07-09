import { BaseApiEndpoint } from "../../../shared/infrastructure/api/base-api.endpoint";
import { SupportTicketAssembler } from "../assembler/support-ticket.assembler";

export class SupportTicketsApiEndpoint extends BaseApiEndpoint {
    constructor() {
        super("/support/tickets", new SupportTicketAssembler());
    }

    async getTicketsByUser(userId) {
        const response = await this.getFromPath(`?userId=${userId}`);
        const resource = response?.data ?? response ?? [];

        return this.assembler.toEntities(resource);
    }

    async resolveTicket(ticketId) {
        const response = await this.postToPath(`/${ticketId}/resolve`);
        const resource = response?.data ?? response;

        return this.assembler.toEntity(resource);
    }
}