export class DeviceStatusPolicyService {
    static canExecuteCommand(device) {
        return device?.status === "online";
    }

    static canCloseValve(valve) {
        return valve?.status === "open";
    }

    static canOpenValve(valve) {
        return valve?.status === "closed";
    }

    static getSensorHealth(sensor) {
        if (!sensor.isActive) return "inactive";
        if (sensor.hasExceededThreshold) return "critical";

        return "normal";
    }
}