export class CreateDeviceGroupCommand {
    constructor({
                    roomId = "",
                    name = "",
                    resourceType = "mixed",
                    status = "active",
                } = {}) {
        this.roomId = roomId;
        this.name = name;
        this.resourceType = resourceType;
        this.status = status;
    }
}
