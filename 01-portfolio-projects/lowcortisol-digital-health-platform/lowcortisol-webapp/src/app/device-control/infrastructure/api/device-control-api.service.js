import { ApiClientService } from "../../../shared/infrastructure/http/api-client.service";
import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";
import {
    estimateConduitFlowPerMinute,
    runLiveConsumptionTick,
} from "../../../shared/infrastructure/data/local-consumption-meter.service";
import { DeviceCommandAssembler } from "../assembler/device-command.assembler";
import { ValveOperationAssembler } from "../assembler/valve-operation.assembler";

const deviceCommandAssembler = new DeviceCommandAssembler();
const valveOperationAssembler = new ValveOperationAssembler();

function normalizeValve(valve) {
    return {
        ...valve,
        isOpen: valve.status === "open",
    };
}

function normalizeSensor(sensor) {
    return {
        ...sensor,
        hasExceededThreshold:
            Boolean(sensor.hasExceededThreshold) ||
            Number(sensor.currentValue || 0) > Number(sensor.threshold || 0),
    };
}

function normalizeDeviceCommand(command = {}) {
    return deviceCommandAssembler.toEntity({
        ...command,
        commandType: command.commandType || command.type || "sync",
        requestedAt: command.requestedAt || command.createdAt,
        executedAt: command.executedAt || command.completedAt || null,
        failureReason: command.failureReason || "",
    });
}

function normalizeValveOperation(operation = {}) {
    return valveOperationAssembler.toEntity({
        ...operation,
        requestedAt: operation.requestedAt || operation.createdAt,
        completedAt: operation.completedAt || operation.executedAt || null,
        failureReason: operation.failureReason || "",
    });
}

function sortByOperationalDate(items = []) {
    return [...items].sort((left, right) => {
        const leftDate = left.executedAt || left.completedAt || left.requestedAt || left.createdAt;
        const rightDate = right.executedAt || right.completedAt || right.requestedAt || right.createdAt;

        return new Date(rightDate).getTime() - new Date(leftDate).getTime();
    });
}

function buildLocalMitigationSummary(commands = [], operations = []) {
    const incidentOperations = operations.filter((operation) => operation.incidentId);
    const lastMitigation = sortByOperationalDate(incidentOperations)[0] || null;

    return {
        totalCommands: commands.length,
        executedCommands: commands.filter((command) => command.status === "executed").length,
        failedCommands: commands.filter((command) => command.status === "failed").length,
        pendingCommands: commands.filter((command) => command.status === "pending").length,
        totalValveOperations: operations.length,
        completedValveOperations: operations.filter((operation) => operation.status === "executed").length,
        failedValveOperations: operations.filter((operation) => operation.status === "failed").length,
        incidentMitigations: incidentOperations.length,
        lastMitigationAt: lastMitigation?.completedAt || lastMitigation?.requestedAt || null,
    };
}

function buildPhysicalPath(site, room, deviceGroup) {
    return [site?.name, room?.name, deviceGroup?.name].filter(Boolean).join(" / ");
}

function getValveSensor(valve) {
    if (!valve) return null;

    return (
        (valve.sensorId && LocalPlatformDataService.getById("sensors", valve.sensorId)) ||
        LocalPlatformDataService
            .list("sensors")
            .find(
                (sensor) =>
                    sensor.deviceId === valve.deviceId &&
                    sensor.resourceType === valve.resourceType
            ) ||
        null
    );
}

function getResourceUnit(resourceType = "water") {
    return resourceType === "gas" ? "m3" : "L";
}

const conduitFlowProfiles = {
    cano: { resourceType: "water", nominalOutput: 180 },
    manguera: { resourceType: "water", nominalOutput: 320 },
    regadera: { resourceType: "water", nominalOutput: 140 },
    ducha: { resourceType: "water", nominalOutput: 160 },
    lavamanos: { resourceType: "water", nominalOutput: 90 },
    lavadero: { resourceType: "water", nominalOutput: 130 },
    inodoro: { resourceType: "water", nominalOutput: 110 },
    riego: { resourceType: "water", nominalOutput: 360 },
    tuberia_agua: { resourceType: "water", nominalOutput: 260 },
    tuberia_gas: { resourceType: "gas", nominalOutput: 70 },
    cocina_gas: { resourceType: "gas", nominalOutput: 42 },
    calentador_gas: { resourceType: "gas", nominalOutput: 58 },
    quemador: { resourceType: "gas", nominalOutput: 76 },
    linea_gas: { resourceType: "gas", nominalOutput: 95 },
};

function calculateConduitConsumption(conduit, valve) {
    const resourceType = conduit?.resourceType || valve?.resourceType || "water";
    const opening = Math.max(0, Math.min(100, Number(valve?.openingPercentage || 0)));
    const profile = conduitFlowProfiles[conduit?.conduitType] || {
        resourceType,
        nominalOutput: resourceType === "gas" ? 60 : 180,
    };
    const normalizedOpening = opening / 100;
    const valveWeight = 0.18 + normalizedOpening * 0.82;
    const output = Number(profile.nominalOutput || 0) * valveWeight;

    if (opening <= 0) return 0;

    if (resourceType === "gas") {
        return Number(output.toFixed(1));
    }

    return Math.round(output);
}

function thresholdMatchesReading(threshold, reading) {
    const isActive = threshold.isActive ?? threshold.enabled ?? true;
    if (!isActive || threshold.resourceType !== reading.resourceType) return false;
    if (threshold.siteId && threshold.siteId !== reading.siteId) return false;
    if (threshold.roomId && threshold.roomId !== reading.roomId) return false;
    if (threshold.deviceGroupId && threshold.deviceGroupId !== reading.deviceGroupId) return false;
    if (threshold.deviceId && threshold.deviceId !== reading.deviceId) return false;
    if (threshold.sensorId && threshold.sensorId !== reading.sensorId) return false;

    return true;
}

function getThresholdLimit(threshold) {
    return Number(threshold.limitValue ?? threshold.criticalLimit ?? threshold.warningLimit ?? 0);
}

function exceedsThreshold(reading, threshold) {
    const value = Number(reading.value || 0);
    const limitValue = getThresholdLimit(threshold);

    switch (threshold.operator) {
        case "greater_than":
            return value > limitValue;
        case "greater_or_equal":
            return value >= limitValue;
        case "less_than":
            return value < limitValue;
        case "less_or_equal":
            return value <= limitValue;
        default:
            return value >= limitValue;
    }
}

function evaluateReadingRisk(reading) {
    const thresholds = LocalPlatformDataService
        .list("thresholds")
        .filter((threshold) => thresholdMatchesReading(threshold, reading));
    const exceededThresholds = thresholds.filter((threshold) => exceedsThreshold(reading, threshold));

    if (!exceededThresholds.length) {
        return {
            readingStatus: "normal",
            anomalies: [],
        };
    }

    const anomalies = exceededThresholds.map((threshold) => {
        const severity = threshold.severity || (threshold.criticalLimit ? "critical" : "warning");
        const limitValue = getThresholdLimit(threshold);

        return LocalPlatformDataService.create("anomalies", {
            readingId: reading.id,
            thresholdId: threshold.id,
            siteId: reading.siteId,
            roomId: reading.roomId,
            deviceGroupId: reading.deviceGroupId,
            deviceId: reading.deviceId,
            sensorId: reading.sensorId,
            resourceType: reading.resourceType,
            value: reading.value,
            limitValue,
            unit: reading.unit,
            severity,
            description: `${reading.value} ${reading.unit} supero el limite de ${limitValue} ${reading.unit}.`,
            status: "open",
            detectedAt: reading.capturedAt || new Date().toISOString(),
        });
    });

    return {
        readingStatus: anomalies.some((anomaly) => anomaly.severity === "critical") ? "critical" : "warning",
        anomalies,
    };
}

function getConduitValve(conduit) {
    if (!conduit?.valveId) return null;

    return LocalPlatformDataService.getById("valves", conduit.valveId);
}

function getConduitSensor(conduit, valve) {
    if (conduit?.sensorId) {
        return LocalPlatformDataService.getById("sensors", conduit.sensorId);
    }

    return getValveSensor(valve);
}

function updateSiteConsumption(siteId, resourceType, value) {
    const site = LocalPlatformDataService.getById("sites", siteId);

    if (!site) return;

    const consumptionKey = resourceType === "gas" ? "gasConsumption" : "waterConsumption";

    LocalPlatformDataService.update("sites", siteId, {
        [consumptionKey]: Number(site[consumptionKey] || 0) + Number(value || 0),
    });
}

function normalizeDevice(device, sensors = [], valves = [], commands = [], physicalModel = {}) {
    const site = physicalModel.site || null;
    const room = physicalModel.room || null;
    const deviceGroup = physicalModel.deviceGroup || null;

    return {
        ...device,
        site,
        room,
        deviceGroup,
        siteName: site?.name || device.siteId,
        roomName: room?.name || device.roomId || "",
        deviceGroupName: deviceGroup?.name || device.deviceGroupId || "",
        physicalPath: buildPhysicalPath(site, room, deviceGroup),
        isOnline: device.status === "online",
        sensors: sensors.filter((sensor) => sensor.deviceId === device.id),
        valves: valves
            .filter((valve) => valve.deviceId === device.id)
            .map(normalizeValve),
        commands: commands.filter((command) => command.deviceId === device.id),
    };
}

export class DeviceControlApiService {
    constructor() {
        this.usingFallback = false;
    }

    isUsingFallback() {
        return this.usingFallback;
    }

    async withBackendFallback(backendAction, localAction) {
        try {
            const result = await backendAction();
            this.usingFallback = false;
            return result;
        } catch (_error) {
            this.usingFallback = true;
            return localAction();
        }
    }

    async getDevices() {
        runLiveConsumptionTick();

        const [devices, sensors, valves, commands, sites, rooms, deviceGroups] = await Promise.all([
            this.getRawDevices(),
            this.getSensors(),
            this.getValves(),
            this.getCommands(),
            LocalPlatformDataService.list("sites"),
            LocalPlatformDataService.list("rooms"),
            LocalPlatformDataService.list("deviceGroups"),
        ]);

        const siteMap = new Map(sites.map((site) => [site.id, site]));
        const roomMap = new Map(rooms.map((room) => [room.id, room]));
        const deviceGroupMap = new Map(
            deviceGroups.map((deviceGroup) => [deviceGroup.id, deviceGroup])
        );

        return devices.map((device) => {
            const deviceGroup = deviceGroupMap.get(device.deviceGroupId) || null;
            const room = roomMap.get(device.roomId || deviceGroup?.roomId) || null;
            const site = siteMap.get(device.siteId || room?.siteId) || null;

            return normalizeDevice(device, sensors, valves, commands, {
                site,
                room,
                deviceGroup,
            });
        });
    }

    async getDeviceById(deviceId) {
        const devices = await this.getDevices();

        return devices.find((device) => device.id === deviceId) || null;
    }

    async getDevicesBySite(siteId) {
        const devices = await this.getDevices();

        return devices.filter((device) => device.siteId === siteId);
    }

    async getRawDevices() {
        return LocalPlatformDataService.list("devices");
    }

    async getSensors() {
        return LocalPlatformDataService.list("sensors").map(normalizeSensor);
    }

    async getValves() {
        return LocalPlatformDataService.list("valves").map(normalizeValve);
    }

    async getCommands() {
        return this.withBackendFallback(
            async () => sortByOperationalDate(
                (await ApiClientService.get("/api/v1/device-commands", { count: 20 }))
                    .map(normalizeDeviceCommand)
            ),
            () => sortByOperationalDate(
                LocalPlatformDataService
                    .list("deviceCommands")
                    .map(normalizeDeviceCommand)
            )
        );
    }

    async getDeviceCommandsByDeviceId(deviceId) {
        return this.withBackendFallback(
            async () => sortByOperationalDate(
                (await ApiClientService.get(`/api/v1/devices/${deviceId}/commands`))
                    .map(normalizeDeviceCommand)
            ),
            () => sortByOperationalDate(
                LocalPlatformDataService
                    .list("deviceCommands", { deviceId })
                    .map(normalizeDeviceCommand)
            )
        );
    }

    async getValveOperationsByValveId(valveId) {
        return this.withBackendFallback(
            async () => sortByOperationalDate(
                (await ApiClientService.get(`/api/v1/valves/${valveId}/operations`))
                    .map(normalizeValveOperation)
            ),
            () => sortByOperationalDate(
                LocalPlatformDataService
                    .list("valveOperations", { valveId })
                    .map(normalizeValveOperation)
            )
        );
    }

    async getValveOperationsByIncidentId(incidentId) {
        return this.withBackendFallback(
            async () => sortByOperationalDate(
                (await ApiClientService.get(`/api/v1/incidents/${incidentId}/valve-operations`))
                    .map(normalizeValveOperation)
            ),
            () => sortByOperationalDate(
                LocalPlatformDataService
                    .list("valveOperations", { incidentId })
                    .map(normalizeValveOperation)
            )
        );
    }

    async getMitigationSummary() {
        return this.withBackendFallback(
            async () => ApiClientService.get("/api/v1/device-control/mitigation-summary"),
            () => buildLocalMitigationSummary(
                LocalPlatformDataService.list("deviceCommands").map(normalizeDeviceCommand),
                LocalPlatformDataService.list("valveOperations").map(normalizeValveOperation)
            )
        );
    }

    async createDevice(device) {
        const deviceGroup =
            LocalPlatformDataService.getById("deviceGroups", device.deviceGroupId) ||
            LocalPlatformDataService.list("deviceGroups")[0] ||
            null;
        const room =
            LocalPlatformDataService.getById("rooms", device.roomId || deviceGroup?.roomId) ||
            null;
        const siteId = device.siteId || room?.siteId || "SITE-001";

        const createdDevice = LocalPlatformDataService.create("devices", {
            siteId,
            roomId: room?.id || device.roomId || "",
            deviceGroupId: deviceGroup?.id || device.deviceGroupId || "",
            name: device.name,
            type: device.type || "hub",
            status: device.status || "online",
            firmwareVersion: device.firmwareVersion || "2.8.1",
            lastSyncAt: new Date().toISOString(),
        });

        LocalPlatformDataService.create("siteDeviceAssignments", {
            siteId: createdDevice.siteId,
            deviceId: createdDevice.id,
            deviceName: createdDevice.name,
            deviceType: createdDevice.type,
            status: createdDevice.status === "maintenance" ? "maintenance" : "active",
        });

        return createdDevice;
    }

    async createConduit(conduit) {
        const valve = LocalPlatformDataService.getById("valves", conduit.valveId);

        if (!valve) {
            throw new Error("Selecciona una valvula valida para registrar el conducto.");
        }

        const existingConduit = LocalPlatformDataService
            .list("devices")
            .find((device) => device.type === "conduit" && device.valveId === valve.id);

        if (existingConduit || valve.conduitId) {
            throw new Error("Esta valvula ya controla otro conducto.");
        }

        const valveDevice = LocalPlatformDataService.getById("devices", valve.deviceId);
        const sensor = getValveSensor(valve);
        const valveSiteId = valve.siteId || valveDevice?.siteId || "";
        const valveRoomId = valve.roomId || valveDevice?.roomId || "";

        if (!sensor) {
            throw new Error("La valvula debe tener un sensor asociado antes de registrar el conducto.");
        }

        if (
            (conduit.siteId && conduit.siteId !== valveSiteId) ||
            (conduit.roomId && conduit.roomId !== valveRoomId)
        ) {
            throw new Error("La valvula seleccionada no pertenece a la sede y habitacion elegidas.");
        }

        const createdConduit = LocalPlatformDataService.create("devices", {
            siteId: valveSiteId,
            roomId: valveRoomId,
            deviceGroupId: valve.deviceGroupId || valveDevice?.deviceGroupId || "",
            name: conduit.name,
            type: "conduit",
            conduitType: conduit.conduitType || "cano",
            resourceType: valve.resourceType || conduit.resourceType || "water",
            flowRatePerMinute: Number(conduit.flowRatePerMinute || 0),
            valveId: valve.id,
            valveName: valve.name,
            sensorId: sensor.id,
            sensorName: sensor.name,
            flowStatus: "stopped",
            lastConsumptionValue: 0,
            totalConsumption: 0,
            lastActivatedAt: null,
            lastStoppedAt: null,
            status: valveDevice?.status || "online",
            firmwareVersion: "",
            lastSyncAt: new Date().toISOString(),
        });

        LocalPlatformDataService.update("valves", valve.id, {
            conduitId: createdConduit.id,
        });

        LocalPlatformDataService.create("siteDeviceAssignments", {
            siteId: createdConduit.siteId,
            deviceId: createdConduit.id,
            deviceName: createdConduit.name,
            deviceType: "conduit",
            status: createdConduit.status === "maintenance" ? "maintenance" : "active",
        });

        return createdConduit;
    }

    async removeConduit(conduitId) {
        const conduit = LocalPlatformDataService.getById("devices", conduitId);

        if (!conduit || conduit.type !== "conduit") {
            throw new Error("Selecciona un conducto valido para desanclarlo.");
        }

        runLiveConsumptionTick({ minimumElapsedSeconds: 0.1, maximumElapsedSeconds: 5 });

        if (conduit.valveId) {
            const valve = LocalPlatformDataService.getById("valves", conduit.valveId);

            if (valve) {
                LocalPlatformDataService.update("valves", valve.id, {
                    conduitId: "",
                });
            }
        }

        LocalPlatformDataService
            .list("siteDeviceAssignments")
            .filter((assignment) => assignment.deviceId === conduit.id)
            .forEach((assignment) => {
                LocalPlatformDataService.remove("siteDeviceAssignments", assignment.id);
            });

        await this.executeCommand({
            deviceId: conduit.id,
            valveId: conduit.valveId || "",
            siteId: conduit.siteId || "",
            roomId: conduit.roomId || "",
            deviceGroupId: conduit.deviceGroupId || "",
            commandType: "removeConduit",
            source: "manual",
            reason: `Conducto desanclado: ${conduit.name}`,
            requestedBy: "Operations",
        });

        LocalPlatformDataService.remove("devices", conduit.id);

        return {
            ...conduit,
            flowStatus: "removed",
        };
    }

    async activateConduit(conduitId) {
        const conduit = LocalPlatformDataService.getById("devices", conduitId);

        if (!conduit || conduit.type !== "conduit") {
            throw new Error("Selecciona un conducto valido para activarlo.");
        }

        const valve = getConduitValve(conduit);
        const sensor = getConduitSensor(conduit, valve);
        const site = LocalPlatformDataService.getById("sites", conduit.siteId || valve?.siteId);
        const requestedAt = new Date().toISOString();

        if (site?.status === "inactive") {
            throw new Error("La sede esta desactivada. Activa la sede antes de usar sus conductos.");
        }

        if (!valve) {
            throw new Error("El conducto no tiene una valvula asignada.");
        }

        if (valve.status !== "open" || Number(valve.openingPercentage || 0) <= 0) {
            throw new Error("Abre la valvula del conducto antes de generar consumo.");
        }

        if (!sensor || sensor.status !== "active") {
            throw new Error("El sensor asociado debe estar activo para medir el consumo.");
        }

        const resourceType = conduit.resourceType || valve.resourceType || sensor.resourceType || "water";
        const unit = sensor.unit || getResourceUnit(resourceType);
        const flowPerMinute = estimateConduitFlowPerMinute(conduit, valve);
        const updatedSensor = LocalPlatformDataService.update("sensors", sensor.id, {
            currentValue: 0,
            flowRatePerMinute: flowPerMinute,
            unit,
            hasExceededThreshold: false,
        });

        const updatedConduit = LocalPlatformDataService.update("devices", conduit.id, {
            flowStatus: "active",
            status: "online",
            lastConsumptionValue: 0,
            lastFlowRate: flowPerMinute,
            totalConsumption: Number(conduit.totalConsumption || 0),
            lastActivatedAt: requestedAt,
            lastMeteredAt: requestedAt,
            lastSyncAt: requestedAt,
        });

        await this.executeCommand({
            deviceId: conduit.id,
            valveId: valve.id,
            siteId: conduit.siteId || valve.siteId || sensor.siteId || "",
            roomId: conduit.roomId || valve.roomId || sensor.roomId || "",
            deviceGroupId: conduit.deviceGroupId || valve.deviceGroupId || sensor.deviceGroupId || "",
            commandType: "activateConduit",
            source: "manual",
            reason: `Medicion en tiempo real iniciada para ${conduit.name}`,
            requestedBy: "Operations",
            payload: {
                sensorId: updatedSensor.id,
                flowPerMinute,
                unit,
            },
        });

        return normalizeDevice(updatedConduit, [updatedSensor], [valve], []);
    }

    async deactivateConduit(conduitId) {
        const conduit = LocalPlatformDataService.getById("devices", conduitId);

        if (!conduit || conduit.type !== "conduit") {
            throw new Error("Selecciona un conducto valido para detenerlo.");
        }

        runLiveConsumptionTick({ minimumElapsedSeconds: 0.1, maximumElapsedSeconds: 5 });

        const requestedAt = new Date().toISOString();
        const updatedConduit = LocalPlatformDataService.update("devices", conduit.id, {
            flowStatus: "stopped",
            lastStoppedAt: requestedAt,
            lastMeteredAt: requestedAt,
            lastSyncAt: requestedAt,
        });

        await this.executeCommand({
            deviceId: conduit.id,
            valveId: conduit.valveId || "",
            siteId: conduit.siteId || "",
            roomId: conduit.roomId || "",
            deviceGroupId: conduit.deviceGroupId || "",
            commandType: "deactivateConduit",
            source: "manual",
            reason: `Conducto detenido: ${conduit.name}`,
            requestedBy: "Operations",
        });

        return normalizeDevice(updatedConduit, [], [], []);
    }

    async linkSensor(sensor) {
        const device = LocalPlatformDataService.getById("devices", sensor.deviceId);
        const currentValue = Number(sensor.currentValue || 0);
        const threshold = Number(sensor.threshold || (sensor.resourceType === "gas" ? 120 : 300));

        return LocalPlatformDataService.create("sensors", {
            deviceId: sensor.deviceId,
            siteId: sensor.siteId || device?.siteId || "",
            roomId: sensor.roomId || device?.roomId || "",
            deviceGroupId: sensor.deviceGroupId || device?.deviceGroupId || "",
            name: sensor.name,
            resourceType: sensor.resourceType || "water",
            currentValue,
            unit: sensor.unit || (sensor.resourceType === "gas" ? "m3" : "L"),
            threshold,
            status: "active",
            hasExceededThreshold: currentValue > threshold,
        });
    }

    async updateValveStatus(command) {
        const status = command.status || "closed";
        const requestedAt = new Date().toISOString();
        const openingPercentage = Number(
            command.openingPercentage ?? (status === "open" ? 100 : 0)
        );
        const currentValve = LocalPlatformDataService.getById("valves", command.valveId);
        const site = LocalPlatformDataService.getById("sites", currentValve?.siteId);
        const device = LocalPlatformDataService.getById("devices", currentValve?.deviceId);
        const sensor = (
            currentValve?.sensorId &&
            LocalPlatformDataService.getById("sensors", currentValve.sensorId)
        ) || LocalPlatformDataService
            .list("sensors")
            .find(
                (entry) =>
                    entry.deviceId === currentValve?.deviceId &&
                    entry.resourceType === currentValve?.resourceType
            );

        if (site?.status === "inactive") {
            throw new Error("La sede esta desactivada. Activa la sede para operar sus valvulas.");
        }

        if (device?.status !== "online") {
            throw new Error("El equipo de la valvula esta apagado.");
        }

        if (sensor?.status !== "active") {
            throw new Error("El sensor asociado esta apagado.");
        }

        const valve = LocalPlatformDataService.update("valves", command.valveId, {
            status,
            openingPercentage,
        });

        const commandPayload = {
            deviceId: valve.deviceId,
            valveId: valve.id,
            siteId: valve.siteId || "",
            roomId: command.roomId || "",
            deviceGroupId: command.deviceGroupId || "",
            incidentId: command.incidentId || "",
            commandType: status === "open" ? "openValve" : "closeValve",
            source: command.source || "manual",
            reason: command.reason || "",
            requestedBy: command.requestedBy || "Operations",
            requestedAt,
            status: "executed",
            executedAt: requestedAt,
            failureReason: "",
        };

        const createdCommand = LocalPlatformDataService.create("deviceCommands", commandPayload);
        LocalPlatformDataService.create("commands", {
            id: createdCommand.id,
            ...commandPayload,
        });

        LocalPlatformDataService.create("valveOperations", {
            valveId: valve.id,
            deviceId: valve.deviceId,
            siteId: valve.siteId || "",
            roomId: command.roomId || "",
            deviceGroupId: command.deviceGroupId || "",
            incidentId: command.incidentId || "",
            resourceType: valve.resourceType || "water",
            previousStatus: currentValve?.status || "",
            targetStatus: status,
            reason: command.reason || "manual_operation",
            source: command.source || "manual",
            status: "executed",
            requestedAt,
            completedAt: requestedAt,
            failureReason: "",
        });

        return normalizeValve(valve);
    }

    async executeCommand(command) {
        const device = LocalPlatformDataService.getById("devices", command.deviceId);
        const requestedAt = new Date().toISOString();
        const commandPayload = {
            deviceId: command.deviceId,
            valveId: command.valveId || "",
            siteId: command.siteId || device?.siteId || "",
            roomId: command.roomId || device?.roomId || "",
            deviceGroupId: command.deviceGroupId || device?.deviceGroupId || "",
            incidentId: command.incidentId || "",
            commandType: command.commandType || "sync",
            source: command.source || "manual",
            reason: command.reason || "",
            requestedBy: command.requestedBy || "Operations",
            requestedAt,
            status: "executed",
            executedAt: requestedAt,
            failureReason: "",
            payload: command.payload || {},
        };

        const createdCommand = LocalPlatformDataService.create("deviceCommands", commandPayload);
        LocalPlatformDataService.create("commands", {
            id: createdCommand.id,
            ...commandPayload,
        });

        if (command.commandType === "sync" || !command.commandType) {
            LocalPlatformDataService.update("devices", command.deviceId, {
                lastSyncAt: new Date().toISOString(),
            });
        }

        return normalizeDeviceCommand(createdCommand);
    }

    async getSummary() {
        const [devices, sensors, valves, commands, mitigationSummary] = await Promise.all([
            this.getRawDevices(),
            this.getSensors(),
            this.getValves(),
            this.getCommands(),
            this.getMitigationSummary(),
        ]);

        return {
            totalDevices: devices.length,
            totalConduits: devices.filter((device) => device.type === "conduit").length,
            waterConduits: devices.filter((device) => device.type === "conduit" && device.resourceType === "water").length,
            gasConduits: devices.filter((device) => device.type === "conduit" && device.resourceType === "gas").length,
            onlineDevices: devices.filter((device) => device.status === "online").length,
            maintenanceDevices: devices.filter((device) => device.status === "maintenance").length,
            totalSensors: sensors.length,
            activeSensors: sensors.filter((sensor) => sensor.status === "active").length,
            totalValves: valves.length,
            openValves: valves.filter((valve) => valve.status === "open").length,
            closedValves: valves.filter((valve) => valve.status === "closed").length,
            commandsExecuted: commands.filter((command) => command.status === "executed").length,
            ...mitigationSummary,
        };
    }
}
