import { SupportApiService } from "../../infrastructure/api/support-api.service";

export class SupportFacade {
    constructor() {
        this.supportApiService = new SupportApiService();
    }

    async getTickets() {
        return this.supportApiService.getTickets();
    }

    async createTicket(payload) {
        return this.supportApiService.createTicket(payload);
    }

    async updateTicket(payload) {
        return this.supportApiService.updateTicket(payload);
    }

    async sendMessage(payload) {
        return this.supportApiService.sendMessage(payload);
    }

    async getAgents() {
        return this.supportApiService.getAgents();
    }

    async getArticles() {
        return this.supportApiService.getArticles();
    }

    async getConversations() {
        return this.supportApiService.getConversations();
    }

    async getConversationByTicket(ticketId) {
        return this.supportApiService.getConversationByTicket(ticketId);
    }

    async getSummary() {
        return this.supportApiService.getSummary();
    }
}