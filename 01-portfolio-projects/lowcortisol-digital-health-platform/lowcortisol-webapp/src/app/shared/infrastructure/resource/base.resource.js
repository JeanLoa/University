export class BaseResource {
    constructor({ id = null, createdAt = null, updatedAt = null } = {}) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}