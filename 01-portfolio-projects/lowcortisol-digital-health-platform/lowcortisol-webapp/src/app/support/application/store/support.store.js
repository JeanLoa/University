import { reactive, readonly } from "vue";
import { SupportFacade } from "../services/support.facade";

const supportFacade = new SupportFacade();

const state = reactive({
    tickets: [],
    agents: [],
    articles: [],
    conversations: [],
    selectedTicketId: null,
    summary: {
        totalTickets: 0,
        openTickets: 0,
        assignedTickets: 0,
        resolvedTickets: 0,
        availableAgents: 0,
        totalArticles: 0,
        totalConversations: 0,
    },
    loading: false,
    error: null,
    message: "",
});

async function loadSupportPage() {
    state.loading = true;
    state.error = null;

    try {
        state.tickets = await supportFacade.getTickets();
        state.agents = await supportFacade.getAgents();
        state.articles = await supportFacade.getArticles();
        state.conversations = await supportFacade.getConversations();
        state.summary = await supportFacade.getSummary();

        if (!state.selectedTicketId && state.tickets.length > 0) {
            state.selectedTicketId = state.tickets[0].id;
        }
    } catch (error) {
        state.error = error.message || "No se pudo cargar soporte.";
    } finally {
        state.loading = false;
    }
}

function selectTicket(ticketId) {
    state.selectedTicketId = ticketId;
}

function getSelectedTicket() {
    return state.tickets.find((ticket) => ticket.id === state.selectedTicketId) ?? null;
}

function getSelectedConversation() {
    return state.conversations.find((conversation) => conversation.ticketId === state.selectedTicketId) ?? null;
}

async function createTicket(payload) {
    const ticket = await supportFacade.createTicket(payload);

    await loadSupportPage();

    state.selectedTicketId = ticket.id;
    state.message = "Ticket creado correctamente.";

    return ticket;
}

async function resolveTicket(ticketId) {
    const ticket = await supportFacade.updateTicket({
        ticketId,
        status: "resolved",
    });

    await loadSupportPage();

    state.message = "Ticket resuelto correctamente.";

    return ticket;
}

async function closeTicket(ticketId) {
    const ticket = await supportFacade.updateTicket({
        ticketId,
        status: "closed",
    });

    await loadSupportPage();

    state.message = "Ticket cerrado correctamente.";

    return ticket;
}

async function sendMessage(content) {
    if (!state.selectedTicketId) return null;

    const message = await supportFacade.sendMessage({
        ticketId: state.selectedTicketId,
        senderId: "USR-001",
        senderType: "user",
        content,
    });

    await loadSupportPage();

    state.message = "Mensaje enviado correctamente.";

    return message;
}

export function useSupportStore() {
    return {
        state: readonly(state),
        loadSupportPage,
        selectTicket,
        getSelectedTicket,
        getSelectedConversation,
        createTicket,
        resolveTicket,
        closeTicket,
        sendMessage,
    };
}