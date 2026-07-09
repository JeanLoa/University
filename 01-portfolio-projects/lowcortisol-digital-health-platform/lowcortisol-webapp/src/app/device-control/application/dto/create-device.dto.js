export class CreateDeviceDto {
    constructor({
                    siteId = "",
                    name = "",
                    type = "hub",
                    status = "online",
                } = {}) {
        this.siteId = siteId;
        this.name = name.trim();
        this.type = type;
        this.status = status;
    }

    isValid() {
        return Boolean(this.siteId && this.name && this.type);
    }

    toPayload() {
        return {
            siteId: this.siteId,
            name: this.name,
            type: this.type,
            status: this.status,
        };
    }
}