import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class AlertDelivery extends BaseEntity {
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
        this.attemptedAt = attemptedAt ? new Date(attemptedAt) : null;
        this.sentAt = sentAt ? new Date(sentAt) : null;
        this.failureReason = failureReason;
    }

    markAsSent() {
        this.status = "sent";
        this.sentAt = new Date();
        this.updateTimestamp();
    }

    markAsFailed(failureReason = "") {
        this.status = "failed";
        this.failureReason = failureReason;
        this.updateTimestamp();
    }
}
