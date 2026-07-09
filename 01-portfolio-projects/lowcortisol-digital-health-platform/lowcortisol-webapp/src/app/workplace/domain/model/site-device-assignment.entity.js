import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class SiteDeviceAssignment extends BaseEntity {
    constructor({
                    id = null,
                    siteId = "",
                    deviceId = "",
                    deviceName = "",
                    deviceType = "sensor",
                    status = "linked",
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.deviceType = deviceType;
        this.status = status;
    }

    unlink() {
        this.status = "unlinked";
        this.updateTimestamp();
    }

    get isLinked() {
        return this.status === "linked";
    }

    get deviceTypeLabel() {
        const labels = {
            sensor: "Sensor",
            valve: "Válvula",
            hub: "Hub",
        };

        return labels[this.deviceType] ?? "Dispositivo";
    }
}