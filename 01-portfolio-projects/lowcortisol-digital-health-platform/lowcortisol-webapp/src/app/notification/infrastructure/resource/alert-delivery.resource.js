import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class AlertDeliveryResource extends BaseResource {
    constructor({
                    id = null,
                    alertId = "",
                    channelId = "",
                    channelType = "in_app",
                    status = "pending",
                    recipientUserId = "",
                    recipientEmail = "",
                    recipientDisplayName = "",
                    messageTitle = "",
                    messageDescription = "",
                    attemptedAt = null,
                    sentAt = null,
                    failureReason = "",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.alertId = alertId;
        this.channelId = channelId;
        this.channelType = channelType;
        this.status = status;
        this.recipientUserId = recipientUserId;
        this.recipientEmail = recipientEmail;
        this.recipientDisplayName = recipientDisplayName;
        this.messageTitle = messageTitle;
        this.messageDescription = messageDescription;
        this.attemptedAt = attemptedAt;
        this.sentAt = sentAt;
        this.failureReason = failureReason;
    }
}
