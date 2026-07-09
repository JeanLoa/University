import { AuthSessionService } from "../../../shared/application/services/auth-session.service";
import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";

const knowledgeArticleGuides = {
    "ARTICLE-001": {
        content:
            "Una alerta critica en LowCortisol significa que una lectura supero el limite configurado para un recurso y una ubicacion. No confirma por si sola una fuga: exige revisar lectura, sensor, conducto y valvula antes de cerrar el caso.",
        steps: [
            "Revisa recurso, sede, ambiente, grupo, conducto y sensor asociados a la alerta.",
            "Compara la lectura contra el limite activo que disparo el evento.",
            "Si el consumo sigue activo, entra a Dispositivos y cierra la valvula asociada al conducto.",
            "Si hay impacto operativo, crea o revisa el incidente desde Alertas.",
            "Genera un reporte del periodo para dejar evidencia del consumo antes y despues de la accion.",
        ],
        checks: [
            "La alerta pertenece a una sede activa y a un recurso correcto: agua o gas.",
            "El sensor existe y esta asociado a la valvula que mide el conducto.",
            "La lectura no proviene de datos antiguos o de una sede eliminada.",
            "El limite configurado representa una regla valida para ese ambiente.",
        ],
    },
    "ARTICLE-002": {
        content:
            "Los sensores alimentan el monitoreo de consumo. Para que una lectura sea confiable, el sensor debe medir el mismo recurso de la valvula, pertenecer al mismo grupo fisico y mantenerse activo cuando la sede tambien este activa.",
        steps: [
            "Confirma que cada valvula operativa tenga un sensor del mismo recurso.",
            "Verifica que el sensor aparezca en la misma sede, ambiente y grupo que la valvula.",
            "Si una sede esta desactivada, no uses sus lecturas para validar consumo real.",
            "Cuando una lectura cambie demasiado rapido, revisa primero la apertura de la valvula y el tipo de conducto.",
            "Si el sensor no reporta, crea un ticket indicando sede, ambiente, valvula y ultimo valor observado.",
        ],
        checks: [
            "El sensor no esta asociado a una ubicacion eliminada.",
            "El sensor y la valvula comparten agua o gas como recurso.",
            "El conducto existe y usa una valvula libre asignada solo a ese conducto.",
            "La medicion se compara contra un limite vigente antes de marcarla como riesgo.",
        ],
    },
};

function getCurrentUserId() {
    const user = AuthSessionService.getCurrentUser();

    if (!user) {
        throw new Error("No hay sesion activa.");
    }

    return user.id;
}

function getMessagesByTicket(ticketId) {
    return LocalPlatformDataService.list("supportMessages", { ticketId });
}

export class SupportApiService {
    async getTickets() {
        const tickets = LocalPlatformDataService.list("supportTickets");

        return tickets.map((ticket) => ({
            ...ticket,
            messages: getMessagesByTicket(ticket.id),
        }));
    }

    async createTicket(ticketRequest) {
        const userId = getCurrentUserId();
        const isDeviceIssue = ticketRequest.category === "device";
        const isIncidentIssue = ticketRequest.category === "incident";
        const ticket = LocalPlatformDataService.create("supportTickets", {
            userId,
            siteId: ticketRequest.siteId || "SITE-001",
            title: ticketRequest.title,
            description: ticketRequest.description,
            category: ticketRequest.category || "technical",
            priority: isIncidentIssue ? "critical" : isDeviceIssue ? "high" : "medium",
            status: isDeviceIssue || isIncidentIssue ? "assigned" : "open",
            assignedAgentId: isDeviceIssue || isIncidentIssue ? "AGENT-002" : "",
        });

        LocalPlatformDataService.create("supportConversations", {
            ticketId: ticket.id,
            status: "active",
        });

        LocalPlatformDataService.create("supportMessages", {
            ticketId: ticket.id,
            senderId: userId,
            senderType: "user",
            content: ticket.description,
            status: "sent",
        });

        return ticket;
    }

    async updateTicket(ticketUpdate) {
        return LocalPlatformDataService.update("supportTickets", ticketUpdate.ticketId, {
            status: ticketUpdate.status,
        });
    }

    async sendMessage(messageRequest) {
        const userId = getCurrentUserId();

        return LocalPlatformDataService.create("supportMessages", {
            ticketId: messageRequest.ticketId,
            senderId: userId,
            senderType: messageRequest.senderType || "user",
            content: messageRequest.content,
            status: "sent",
        });
    }

    async getAgents() {
        return LocalPlatformDataService.list("supportAgents");
    }

    async getArticles() {
        return LocalPlatformDataService.list("knowledgeArticles").map((article) => {
            const guide = knowledgeArticleGuides[article.id] || {};

            return {
                ...article,
                content: article.content || guide.content || "",
                steps: article.steps || guide.steps || [],
                checks: article.checks || guide.checks || [],
            };
        });
    }

    async getConversations() {
        const conversations = LocalPlatformDataService.list("supportConversations");

        return conversations.map((conversation) => ({
            ...conversation,
            messages: getMessagesByTicket(conversation.ticketId),
        }));
    }

    async getConversationByTicket(ticketId) {
        const conversations = await this.getConversations();

        return conversations.find((conversation) => conversation.ticketId === ticketId) || null;
    }

    async getSummary() {
        const [tickets, agents, articles, conversations] = await Promise.all([
            this.getTickets(),
            this.getAgents(),
            this.getArticles(),
            this.getConversations(),
        ]);

        return {
            totalTickets: tickets.length,
            openTickets: tickets.filter((ticket) => ticket.status === "open").length,
            assignedTickets: tickets.filter((ticket) => ticket.status === "assigned").length,
            resolvedTickets: tickets.filter((ticket) => ticket.status === "resolved").length,
            availableAgents: agents.filter((agent) => agent.status === "available").length,
            totalArticles: articles.length,
            totalConversations: conversations.length,
        };
    }
}
