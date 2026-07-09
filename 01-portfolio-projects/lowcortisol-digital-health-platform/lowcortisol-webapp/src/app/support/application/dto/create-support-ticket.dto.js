export class CreateSupportTicketDto {
    constructor({
                    userId = "",
                    siteId = "",
                    title = "",
                    description = "",
                    category = "technical",
                } = {}) {
        this.userId = userId;
        this.siteId = siteId;
        this.title = title.trim();
        this.description = description.trim();
        this.category = category;
    }

    isValid() {
        return Boolean(this.userId && this.title && this.description);
    }

    toPayload() {
        return {
            userId: this.userId,
            siteId: this.siteId,
            title: this.title,
            description: this.description,
            category: this.category,
        };
    }
}