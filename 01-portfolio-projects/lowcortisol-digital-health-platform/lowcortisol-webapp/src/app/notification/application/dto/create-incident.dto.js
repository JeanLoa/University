export class CreateIncidentDto {
    constructor({
                    alertId = "",
                    siteId = "",
                    title = "",
                    description = "",
                    priority = "medium",
                } = {}) {
        this.alertId = alertId;
        this.siteId = siteId;
        this.title = title.trim();
        this.description = description.trim();
        this.priority = priority;
    }

    isValid() {
        return Boolean(this.alertId && this.siteId && this.title);
    }

    toPayload() {
        return {
            alertId: this.alertId,
            siteId: this.siteId,
            title: this.title,
            description: this.description,
            priority: this.priority,
        };
    }
}