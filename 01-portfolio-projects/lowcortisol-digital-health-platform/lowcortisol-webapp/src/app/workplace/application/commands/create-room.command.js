export class CreateRoomCommand {
    constructor({
                    siteId = "",
                    name = "",
                    type = "custom",
                    status = "active",
                } = {}) {
        this.siteId = siteId;
        this.name = name;
        this.type = type;
        this.status = status;
    }
}
