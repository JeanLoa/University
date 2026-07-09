export class AlertPriorityService {
    static resolvePriority(severity) {
        const priorities = {
            info: "low",
            warning: "medium",
            critical: "critical",
        };

        return priorities[severity] ?? "medium";
    }

    static shouldCreateIncident(alert) {
        return alert.severity === "critical" || alert.severity === "warning";
    }

    static shouldNotifyImmediately(alert) {
        return alert.severity === "critical";
    }
}