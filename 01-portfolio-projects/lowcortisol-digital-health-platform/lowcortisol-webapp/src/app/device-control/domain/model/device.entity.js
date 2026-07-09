import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Device extends BaseEntity {
    constructor({
                    id = null,
                    siteId = "",
                    name = "",
                    type = "hub",
                    status = "online",
                    sensors = [],
                    valves = [],
                    commands = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.siteId = siteId;
        this.name = name;
        this.type = type;
        this.status = status;
        this.sensors = sensors;
        this.valves = valves;
        this.commands = commands;
    }

    addSensor(sensor) {
        this.sensors.push(sensor);
        this.updateTimestamp();
    }

    addValve(valve) {
        this.valves.push(valve);
        this.updateTimestamp();
    }

    registerCommand(command) {
        this.commands.push(command);
        this.updateTimestamp();
    }

    setOnline() {
        this.status = "online";
        this.updateTimestamp();
    }

    setOffline() {
        this.status = "offline";
        this.updateTimestamp();
    }

    get isOnline() {
        return this.status === "online";
    }

    get typeLabel() {
        const labels = {
            hub: "Hub",
            sensor: "Sensor",
            valve: "Válvula",
        };

        return labels[this.type] ?? "Dispositivo";
    }

    get statusLabel() {
        const labels = {
            online: "En línea",
            offline: "Desconectado",
            maintenance: "Mantenimiento",
        };

        return labels[this.status] ?? "Sin estado";
    }
}