import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class AuthSessionResource extends BaseResource {
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
        this.startedAt = startedAt;
        this.expiresAt = expiresAt;
    }
}