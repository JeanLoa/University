export class SendSupportMessageDto {
    constructor({
                    ticketId = "",
                    senderId = "",
                    senderType = "user",
                    content = "",
                } = {}) {
        this.ticketId = ticketId;
        this.senderId = senderId;
        this.senderType = senderType;
        this.content = content.trim();
    }

    isValid() {
        return Boolean(this.ticketId && this.senderId && this.content);
    }

    toPayload() {
        return {
            ticketId: this.ticketId,
            senderId: this.senderId,
            senderType: this.senderType,
            content: this.content,
        };
    }
}