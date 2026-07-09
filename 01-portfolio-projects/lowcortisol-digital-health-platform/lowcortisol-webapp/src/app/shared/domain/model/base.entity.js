export class BaseEntity {
    constructor({ id = null, createdAt = null, updatedAt = null } = {}) {
        this.id = id ?? crypto.randomUUID?.() ?? String(Date.now());
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    }

    updateTimestamp() {
        this.updatedAt = new Date();
    }
}