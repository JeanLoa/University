export class SupportPriorityService {
    static resolvePriority(category) {
        const priorities = {
            technical: "medium",
            billing: "low",
            device: "high",
            incident: "critical",
        };

        return priorities[category] ?? "medium";
    }

    static shouldAssignImmediately(ticket) {
        return ticket.priority === "high" || ticket.priority === "critical";
    }

    static isUrgent(ticket) {
        return ticket.priority === "critical";
    }
}