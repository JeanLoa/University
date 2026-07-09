export class CreateSiteCommand {
    constructor({
                    workplaceId = "",
                    name = "",
                    address = "",
                    type = "residential",
                    status = "active",
                    latitude = null,
                    longitude = null,
                } = {}) {
        this.workplaceId = workplaceId;
        this.name = name;
        this.address = address;
        this.type = type;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
