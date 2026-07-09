import { reactive, readonly } from "vue";
import { DeviceControlFacade } from "../services/device-control.facade";
import { SubscriptionAccessService } from "../../../shared/application/services/subscription-access.service";

const deviceControlFacade = new DeviceControlFacade();

const state = reactive({
    devices: [],
    conduits: [],
    sensors: [],
    valves: [],
    commands: [],
    valveOperations: [],
    mitigationSummary: {
        totalCommands: 0,
        executedCommands: 0,
        failedCommands: 0,
        pendingCommands: 0,
        totalValveOperations: 0,
        completedValveOperations: 0,
        failedValveOperations: 0,
        incidentMitigations: 0,
        lastMitigationAt: null,
    },
    summary: {
        totalDevices: 0,
        onlineDevices: 0,
        totalSensors: 0,
        activeSensors: 0,
        totalValves: 0,
        openValves: 0,
        closedValves: 0,
        commandsExecuted: 0,
    },
    selectedDeviceId: null,
    loading: false,
    error: null,
    message: "",
    usingFallback: false,
});

function updateFallbackFlag() {
    state.usingFallback = deviceControlFacade.isUsingFallback();
}

async function loadDevicePage(options = {}) {
    const silent = Boolean(options.silent);

    if (!silent) {
        state.loading = true;
    }
    state.error = null;

    try {
        const [devices, sensors, valves, commands, mitigationSummary, summary] = await Promise.all([
            deviceControlFacade.getDevices(),
            deviceControlFacade.getSensors(),
            deviceControlFacade.getValves(),
            deviceControlFacade.getCommands(),
            deviceControlFacade.getMitigationSummary(),
            deviceControlFacade.getSummary(),
        ]);

        state.devices = devices;
        state.conduits = devices.filter((device) => device.type === "conduit");
        state.sensors = sensors;
        state.valves = valves;
        state.commands = commands;
        state.mitigationSummary = mitigationSummary;
        state.summary = {
            ...summary,
            ...mitigationSummary,
        };
        state.valveOperations = (
            await Promise.all(
                valves.map((valve) => deviceControlFacade.getValveOperationsByValveId(valve.id))
            )
        ).flat();

        if (!state.selectedDeviceId && state.conduits.length > 0) {
            state.selectedDeviceId = state.conduits[0].id;
        }

        updateFallbackFlag();
    } catch (error) {
        state.error = error.message || "No se pudo cargar la gestión de dispositivos.";
    } finally {
        if (!silent) {
            state.loading = false;
        }
    }
}

async function refreshDevicePage() {
    await loadDevicePage({ silent: true });
}

function selectDevice(deviceId) {
    state.selectedDeviceId = deviceId;
}

function getSelectedDevice() {
    return state.devices.find((device) => device.id === state.selectedDeviceId) ?? null;
}

function getSelectedDeviceCommands() {
    return state.commands.filter((command) => command.deviceId === state.selectedDeviceId);
}

function getSelectedDeviceValveOperations() {
    return state.valveOperations.filter((operation) => operation.deviceId === state.selectedDeviceId);
}

function getValveOperationsByIncidentId(incidentId) {
    return state.valveOperations.filter((operation) => operation.incidentId === incidentId);
}

function getValvePlacement(valveId) {
    const valve = state.valves.find((item) => item.id === valveId) || null;
    const device = state.devices.find((item) => item.id === valve?.deviceId) || null;

    return {
        valve,
        device,
        siteStatus: device?.site?.status || "",
        siteId: valve?.siteId || device?.siteId || "",
        roomId: valve?.roomId || device?.roomId || "",
        deviceGroupId: valve?.deviceGroupId || device?.deviceGroupId || "",
    };
}

function ensureValveCanOperate(placement) {
    if (placement.siteStatus === "inactive") {
        state.message = "La sede esta desactivada. Activa la sede para operar sus valvulas.";
        throw new Error(state.message);
    }
}

async function createDevice(payload) {
    await SubscriptionAccessService.assertCanAddDevices(1);

    const device = await deviceControlFacade.createDevice(payload);

    await refreshDevicePage();

    state.selectedDeviceId = device.id;
    state.message = "Dispositivo creado correctamente.";

    return device;
}

async function createConduit(payload) {
    await SubscriptionAccessService.assertCanAddDevices(1);

    const conduit = await deviceControlFacade.createConduit(payload);

    await refreshDevicePage();

    state.selectedDeviceId = conduit.id;
    state.message = "Conducto registrado correctamente.";

    return conduit;
}

async function removeConduit(conduitId) {
    const conduit = await deviceControlFacade.removeConduit(conduitId);

    state.selectedDeviceId = null;
    await refreshDevicePage();

    if (state.conduits.length > 0) {
        state.selectedDeviceId = state.conduits[0].id;
    }

    state.message = "Conducto desanclado. La valvula y el sensor asociados quedaron disponibles.";

    return conduit;
}

async function activateConduit(conduitId) {
    const conduit = await deviceControlFacade.activateConduit(conduitId);

    await refreshDevicePage();

    state.selectedDeviceId = conduit.id;
    state.message = "";

    return conduit;
}

async function deactivateConduit(conduitId) {
    const conduit = await deviceControlFacade.deactivateConduit(conduitId);

    await refreshDevicePage();

    state.selectedDeviceId = conduit.id;
    state.message = "";

    return conduit;
}

async function linkSensor(payload) {
    const sensor = await deviceControlFacade.linkSensor(payload);

    await refreshDevicePage();

    state.message = "Sensor vinculado correctamente.";

    return sensor;
}

async function closeValve(valveId) {
    const placement = getValvePlacement(valveId);
    ensureValveCanOperate(placement);
    const valve = await deviceControlFacade.updateValveStatus({
        valveId,
        status: "closed",
        openingPercentage: 0,
        siteId: placement.siteId,
        roomId: placement.roomId,
        deviceGroupId: placement.deviceGroupId,
        source: "manual",
        requestedBy: "Operations",
    });

    await refreshDevicePage();

    state.message = "";

    return valve;
}

async function openValve(valveId) {
    const placement = getValvePlacement(valveId);
    ensureValveCanOperate(placement);
    const valve = await deviceControlFacade.updateValveStatus({
        valveId,
        status: "open",
        openingPercentage: 100,
        siteId: placement.siteId,
        roomId: placement.roomId,
        deviceGroupId: placement.deviceGroupId,
        source: "manual",
        requestedBy: "Operations",
    });

    await refreshDevicePage();

    state.message = "";

    return valve;
}

async function setValveOpening(valveId, openingPercentage) {
    const placement = getValvePlacement(valveId);
    ensureValveCanOperate(placement);
    const normalizedOpening = Math.max(0, Math.min(100, Number(openingPercentage || 0)));
    const status = normalizedOpening > 0 ? "open" : "closed";
    const valve = await deviceControlFacade.updateValveStatus({
        valveId,
        status,
        openingPercentage: normalizedOpening,
        siteId: placement.siteId,
        roomId: placement.roomId,
        deviceGroupId: placement.deviceGroupId,
        source: "manual",
        requestedBy: "Operations",
        reason: "manual_opening_adjustment",
    });

    await refreshDevicePage();

    state.message = "";

    return valve;
}

async function executeSyncCommand(deviceId) {
    const command = await deviceControlFacade.executeCommand({
        deviceId,
        commandType: "sync",
        payload: {
            source: "devices-page",
        },
    });

    await refreshDevicePage();

    state.message = "Comando ejecutado correctamente.";

    return command;
}

export function useDeviceControlStore() {
    return {
        state: readonly(state),
        loadDevicePage,
        refreshDevicePage,
        selectDevice,
        getSelectedDevice,
        getSelectedDeviceCommands,
        getSelectedDeviceValveOperations,
        getValveOperationsByIncidentId,
        createDevice,
        createConduit,
        removeConduit,
        activateConduit,
        deactivateConduit,
        linkSensor,
        closeValve,
        openValve,
        setValveOpening,
        executeSyncCommand,
    };
}
