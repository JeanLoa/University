export class CreateSiteDto {
    constructor({
                    workplaceId = "",
                    name = "",
                    address = "",
                    type = "residential",
                    status = "active",
                } = {}) {
        this.workplaceId = workplaceId;
        this.name = name.trim();
        this.address = address.trim();
        this.type = type;
        this.status = status;
    }

    isValid() {
        return Boolean(this.workplaceId && this.name && this.address && this.type);
    }

    toPayload() {
        return {
            workplaceId: this.workplaceId,
            name: this.name,
            address: this.address,
            type: this.type,
            status: this.status,
        };
    }
}