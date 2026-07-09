import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class AuthSession extends BaseEntity {
    constructor({
                    id = null,
                    userId = "",
                    token = "",
                    refreshToken = "",
                    isActive = true,
                    startedAt = new Date(),
                    expiresAt = null,
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.userId = userId;
        this.token = token;
        this.refreshToken = refreshToken;
        this.isActive = isActive;
        this.startedAt = startedAt ? new Date(startedAt) : new Date();
        this.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    close() {
        this.isActive = false;
        this.updateTimestamp();
    }

    get isExpired() {
        if (!this.expiresAt) return false;

        return new Date() > this.expiresAt;
    }

    get canAccess() {
        return this.isActive && !this.isExpired;
    }
}