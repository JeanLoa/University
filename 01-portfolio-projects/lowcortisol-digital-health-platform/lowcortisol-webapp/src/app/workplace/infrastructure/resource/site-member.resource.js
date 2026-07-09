import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class SiteMemberResource extends BaseResource {
    constructor({
                    id = null,
                    siteId = "",
                    userId = "",
                    fullName = "",
                    email = "",
                    role = "operator",
                    status = "active",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.status = status;
    }
}