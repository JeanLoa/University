import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class DeviceCommand extends BaseEntity {
    constructor({
                    id = null,
                    deviceId = "",
                    valveId = "",
                    siteId = "",
                    roomId = "",
                    deviceGroupId = "",
                    incidentId = "",
                    commandType = "sync",
                    source = "manual",
                    reason = "",
                    requestedBy = "",
                    requestedAt = null,
                    status = "pending",
                    executedAt = null,
                    failureReason = "",
                    payload = {},
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.deviceId = deviceId;
        this.valveId = valveId;
        this.siteId = siteId;
        this.roomId = roomId;
        this.deviceGroupId = deviceGroupId;
        this.incidentId = incidentId;
        this.commandType = commandType;
        this.source = source;
        this.reason = reason;
        this.requestedBy = requestedBy;
        this.requestedAt = requestedAt ? new Date(requestedAt) : this.createdAt;
        this.status = status;
        this.executedAt = executedAt ? new Date(executedAt) : null;
        this.failureReason = failureReason;
        this.payload = payload;
    }

    markAsExecuted() {
        this.status = "executed";
        this.executedAt = new Date();
        this.updateTimestamp();
    }

    markAsFailed(failureReason = "") {
        this.status = "failed";
        this.failureReason = failureReason;
        this.updateTimestamp();
    }

    get isLinkedToIncident() {
        return Boolean(this.incidentId);
    }

    get statusLabel() {
        const labels = {
            pending: "Pendiente",
            executed: "Ejecutado",
            failed: "Fallido",
        };

        return labels[this.status] ?? "Sin estado";
    }

    get commandLabel() {
        const labels = {
            sync: "Sincronizar",
            closeValve: "Cerrar válvula",
            openValve: "Abrir válvula",
            reboot: "Reiniciar",
        };

        return labels[this.commandType] ?? "Comando";
    }
}
