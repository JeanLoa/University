import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class UserResource extends BaseResource {
    constructor({
                    id = null,
                    fullName = "",
                    email = "",
                    phone = "",
                    status = "active",
                    accessProfileId = "",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.status = status;
        this.accessProfileId = accessProfileId;
    }
}