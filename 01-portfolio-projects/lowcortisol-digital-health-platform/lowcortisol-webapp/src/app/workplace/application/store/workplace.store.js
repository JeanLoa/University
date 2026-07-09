import { reactive, readonly } from "vue";
import { WorkplaceFacade } from "../services/workplace.facade";
import { CreateDeviceGroupCommand } from "../commands/create-device-group.command";
import { CreateRoomCommand } from "../commands/create-room.command";
import { CreateSiteCommand } from "../commands/create-site.command";
import { SubscriptionAccessService } from "../../../shared/application/services/subscription-access.service";

const workplaceFacade = new WorkplaceFacade();

const state = reactive({
    workplace: null,
    sites: [],
    rooms: [],
    members: [],
    assignments: [],
    physicalModel: null,
    selectedType: "all",
    selectedSiteId: null,
    selectedRoomId: null,
    selectedDeviceGroupId: null,
    summary: null,
    loading: false,
    error: null,
});

async function loadWorkplace() {
    state.loading = true;
    state.error = null;

    try {
        state.workplace = await workplaceFacade.getWorkplace();
        state.sites = await workplaceFacade.getSites(state.selectedType);
        state.summary = await workplaceFacade.getSummary();

        if (!state.selectedSiteId && state.sites.length > 0) {
            state.selectedSiteId = state.sites[0].id;
        }

        await loadSelectedSiteRelations();
        await loadSelectedSitePhysicalModel();
    } catch (error) {
        state.error = error.message || "No se pudo cargar el workplace.";
    } finally {
        state.loading = false;
    }
}

async function filterSitesByType(type) {
    state.selectedType = type;
    state.sites = await workplaceFacade.getSites(type);

    if (state.sites.length > 0) {
        state.selectedSiteId = state.sites[0].id;
        await loadSelectedSiteRelations();
        await loadSelectedSitePhysicalModel();
    }
}

async function selectSite(siteId) {
    state.selectedSiteId = siteId;
    state.selectedRoomId = null;
    state.selectedDeviceGroupId = null;
    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();
}

function selectRoom(roomId) {
    state.selectedRoomId = roomId;
    state.selectedDeviceGroupId = null;
}

function selectDeviceGroup(deviceGroupId) {
    state.selectedDeviceGroupId = deviceGroupId;
}

async function loadSelectedSiteRelations() {
    if (!state.selectedSiteId) {
        state.members = [];
        state.assignments = [];
        return;
    }

    state.members = await workplaceFacade.getMembersBySite(state.selectedSiteId);
    state.assignments = await workplaceFacade.getAssignmentsBySite(state.selectedSiteId);
}

async function loadSelectedSitePhysicalModel() {
    if (!state.selectedSiteId) {
        state.rooms = [];
        state.physicalModel = null;
        return;
    }

    state.physicalModel = await workplaceFacade.getPhysicalModelBySite(state.selectedSiteId);
    state.rooms = state.physicalModel?.rooms ?? [];

    if (!state.selectedRoomId && state.rooms.length > 0) {
        state.selectedRoomId = state.rooms[0].id;
    }
}

async function createSite(payload) {
    await SubscriptionAccessService.assertCanCreateSite();

    const site = await workplaceFacade.createSite(new CreateSiteCommand(payload));

    state.sites = await workplaceFacade.getSites(state.selectedType);
    state.summary = await workplaceFacade.getSummary();
    state.selectedSiteId = site.id;
    state.selectedRoomId = null;
    state.selectedDeviceGroupId = null;

    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();

    return site;
}

async function updateSiteStatus(siteId, status, snapshot = null) {
    const site = await workplaceFacade.updateSiteStatus(siteId, status, snapshot);
    const inactive = status === "inactive";

    state.sites = state.sites.map((entry) =>
        entry.id === siteId
            ? {
                ...entry,
                status,
                activeSensors: inactive ? 0 : entry.activeSensors,
            }
            : entry
    );
    state.rooms = state.rooms.map((room) => ({
        ...room,
        status: inactive ? "inactive" : "active",
        deviceGroups: (room.deviceGroups || []).map((group) => ({
            ...group,
            status: inactive ? "inactive" : "active",
            devices: (group.devices || []).map((device) => ({
                ...device,
                status: inactive ? "offline" : "online",
            })),
            sensors: (group.sensors || []).map((sensor) => ({
                ...sensor,
                status: inactive ? "inactive" : "active",
                hasExceededThreshold: inactive ? false : sensor.hasExceededThreshold,
            })),
            valves: (group.valves || []).map((valve) => ({
                ...valve,
                status: inactive ? "closed" : valve.status,
                openingPercentage: inactive ? 0 : valve.openingPercentage,
            })),
        })),
    }));
    state.summary = {
        ...(state.summary || {}),
        activeSites: state.sites.filter((entry) => entry.status === "active").length,
        maintenanceSites: state.sites.filter((entry) => entry.status === "maintenance").length,
    };
    state.selectedSiteId = siteId;
    await loadSelectedSiteRelations();

    return site;
}

async function deleteSite(siteId, snapshot = null) {
    await workplaceFacade.deleteSite(siteId, snapshot);

    state.sites = state.sites.filter((site) => site.id !== siteId);
    state.summary = {
        ...(state.summary || {}),
        totalSites: state.sites.length,
        activeSites: state.sites.filter((site) => site.status === "active").length,
        maintenanceSites: state.sites.filter((site) => site.status === "maintenance").length,
    };
    state.selectedSiteId = state.sites[0]?.id ?? null;
    state.selectedRoomId = null;
    state.selectedDeviceGroupId = null;

    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();
}

async function createRoom(payload) {
    const room = await workplaceFacade.createRoom(new CreateRoomCommand(payload));

    state.summary = await workplaceFacade.getSummary();
    state.selectedRoomId = room.id;
    state.selectedDeviceGroupId = null;
    await loadSelectedSitePhysicalModel();

    return room;
}

async function createDeviceGroup(payload) {
    const deviceGroup = await workplaceFacade.createDeviceGroup(
        new CreateDeviceGroupCommand(payload)
    );

    state.summary = await workplaceFacade.getSummary();
    state.selectedDeviceGroupId = deviceGroup.id;
    await loadSelectedSitePhysicalModel();

    return deviceGroup;
}

async function addDeviceToGroup(payload) {
    await SubscriptionAccessService.assertCanAddDevices(1);

    const result = await workplaceFacade.addDeviceToGroup(payload);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();
    state.selectedDeviceGroupId = payload.deviceGroupId;

    return result;
}

async function assignMemberToSite(payload) {
    const member = await workplaceFacade.assignMemberToSite(payload);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();

    return member;
}

async function assignDeviceToSite(payload) {
    const assignment = await workplaceFacade.assignDeviceToSite(payload);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();

    return assignment;
}

async function removeMemberFromSite(memberId) {
    const member = await workplaceFacade.removeMemberFromSite(memberId);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();

    return member;
}

async function removeSensorFromGroup(sensorId) {
    const sensor = await workplaceFacade.removeSensorFromGroup(sensorId);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();

    return sensor;
}

async function removeDeviceFromGroup(deviceId) {
    const device = await workplaceFacade.removeDeviceFromGroup(deviceId);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();

    return device;
}

async function updateDeviceStatus(deviceId, status) {
    const device = await workplaceFacade.updateDeviceStatus(deviceId, status);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();

    return device;
}

async function updateSensorStatus(sensorId, status) {
    const sensor = await workplaceFacade.updateSensorStatus(sensorId, status);

    state.summary = await workplaceFacade.getSummary();
    await loadSelectedSiteRelations();
    await loadSelectedSitePhysicalModel();

    return sensor;
}

function getSelectedSite() {
    return state.sites.find((site) => site.id === state.selectedSiteId) ?? null;
}

function getSelectedRoom() {
    return state.rooms.find((room) => room.id === state.selectedRoomId) ?? null;
}

function getSelectedDeviceGroup() {
    return (
        state.rooms
            .flatMap((room) => room.deviceGroups || [])
            .find((group) => group.id === state.selectedDeviceGroupId) ?? null
    );
}

export function useWorkplaceStore() {
    return {
        state: readonly(state),
        loadWorkplace,
        filterSitesByType,
        selectSite,
        selectRoom,
        selectDeviceGroup,
        createSite,
        updateSiteStatus,
        deleteSite,
        createRoom,
        createDeviceGroup,
        addDeviceToGroup,
        assignMemberToSite,
        assignDeviceToSite,
        removeMemberFromSite,
        removeSensorFromGroup,
        removeDeviceFromGroup,
        updateDeviceStatus,
        updateSensorStatus,
        getSelectedSite,
        getSelectedRoom,
        getSelectedDeviceGroup,
    };
}
