import { ApiClientService } from "../../../shared/infrastructure/http/api-client.service";
import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";
import { DeviceGroupAssembler } from "../assembler/device-group.assembler";
import { RoomAssembler } from "../assembler/room.assembler";
import { SiteAssembler } from "../assembler/site.assembler";

const siteAssembler = new SiteAssembler();
const roomAssembler = new RoomAssembler();
const deviceGroupAssembler = new DeviceGroupAssembler();
const SITE_DELETION_TOMBSTONES = "siteDeletionTombstones";

function getSiteTotals(sites) {
    return {
        waterConsumption: sites.reduce(
            (total, site) => total + Number(site.waterConsumption || 0),
            0
        ),
        gasConsumption: sites.reduce(
            (total, site) => total + Number(site.gasConsumption || 0),
            0
        ),
    };
}

function getDeviceGroupInventory(deviceGroupId) {
    const devices = LocalPlatformDataService.list("devices", { deviceGroupId });
    const deviceIds = devices.map((device) => device.id);
    const sensors = LocalPlatformDataService.list("sensors").filter((sensor) =>
        deviceIds.includes(sensor.deviceId) || sensor.deviceGroupId === deviceGroupId
    );
    const sensorIds = sensors.map((sensor) => sensor.id);
    const valves = LocalPlatformDataService.list("valves").filter((valve) =>
        deviceIds.includes(valve.deviceId) ||
        valve.deviceGroupId === deviceGroupId ||
        sensorIds.includes(valve.sensorId)
    );

    return { devices, sensors, valves };
}

function getResourceName(resourceType) {
    const labels = {
        water: "agua",
        gas: "gas",
        mixed: "mixto",
    };

    return labels[resourceType] || "recurso";
}

function mergeById(primary = [], secondary = []) {
    return Array.from(
        new Map(
            [...primary, ...secondary]
                .filter((item) => item?.id)
                .map((item) => [item.id, item])
        ).values()
    );
}

function enrichGroupWithLocalInventory(group) {
    const inventory = getDeviceGroupInventory(group.id);

    return {
        ...group,
        devices: mergeById(group.devices || [], inventory.devices),
        sensors: mergeById(group.sensors || [], inventory.sensors),
        valves: mergeById(group.valves || [], inventory.valves),
    };
}

function buildRoomModel(room) {
    const deviceGroups = LocalPlatformDataService.list("deviceGroups", {
        roomId: room.id,
    }).map((group) => ({
        ...group,
        ...getDeviceGroupInventory(group.id),
    }));

    return {
        ...room,
        deviceGroups,
    };
}

function ensureLocalRecord(collectionName, id, attributes = {}) {
    if (!id) return null;

    return (
        LocalPlatformDataService.getById(collectionName, id) ||
        LocalPlatformDataService.create(collectionName, {
            id,
            ...attributes,
        })
    );
}

function getDeviceGroupPlacement(payload) {
    const deviceGroupId = payload.deviceGroupId;
    let deviceGroup = LocalPlatformDataService.getById("deviceGroups", deviceGroupId);
    let room = LocalPlatformDataService.getById("rooms", deviceGroup?.roomId || payload.roomId);
    let site = LocalPlatformDataService.getById("sites", room?.siteId || payload.siteId);

    site = site || ensureLocalRecord("sites", payload.siteId, {
        workplaceId: payload.workplaceId || "WORKPLACE-001",
        name: payload.siteName || "Sede seleccionada",
        address: payload.siteAddress || "",
        type: payload.siteType || "residential",
        status: payload.siteStatus || "active",
        waterConsumption: 0,
        gasConsumption: 0,
        activeSensors: 0,
        activeIncidents: 0,
        latitude: null,
        longitude: null,
    });
    room = room || ensureLocalRecord("rooms", payload.roomId, {
        siteId: site?.id || payload.siteId,
        name: payload.roomName || "Ambiente seleccionado",
        type: payload.roomType || "custom",
        status: site?.status === "inactive" ? "inactive" : payload.roomStatus || "active",
    });
    deviceGroup = deviceGroup || ensureLocalRecord("deviceGroups", deviceGroupId, {
        roomId: room?.id || payload.roomId,
        name: payload.deviceGroupName || "Grupo seleccionado",
        resourceType: payload.deviceGroupResourceType || payload.resourceType || "mixed",
        status: site?.status === "inactive" ? "inactive" : payload.deviceGroupStatus || "active",
    });

    if (!deviceGroup || !room || !site) {
        throw new Error("No se encontro el grupo de dispositivos.");
    }

    return {
        deviceGroup,
        room,
        site,
    };
}

async function withBackendFallback(backendAction, localAction) {
    try {
        return await backendAction();
    } catch {
        return localAction();
    }
}

function updateLocalItems(collectionName, predicate, attributes) {
    LocalPlatformDataService
        .list(collectionName)
        .filter(predicate)
        .forEach((item) => {
            LocalPlatformDataService.update(collectionName, item.id, attributes);
        });
}

function removeLocalItems(collectionName, predicate) {
    LocalPlatformDataService
        .list(collectionName)
        .filter(predicate)
        .forEach((item) => {
            LocalPlatformDataService.remove(collectionName, item.id);
        });
}

function normalizeLookupText(value) {
    return String(value || "").trim().toLowerCase();
}

function getDeletedSiteTombstones() {
    return LocalPlatformDataService.list(SITE_DELETION_TOMBSTONES);
}

function siteMatchesTombstone(site, tombstone) {
    if (!site || !tombstone) return false;

    const sameId = tombstone.siteId && site.id === tombstone.siteId;
    const sameName =
        tombstone.name &&
        normalizeLookupText(site.name) === normalizeLookupText(tombstone.name);
    const sameAddress =
        tombstone.address &&
        normalizeLookupText(site.address) === normalizeLookupText(tombstone.address);

    return Boolean(sameId || sameName || sameAddress);
}

function isDeletedSite(site) {
    return getDeletedSiteTombstones().some((tombstone) =>
        siteMatchesTombstone(site, tombstone)
    );
}

function filterDeletedSites(sites = []) {
    return sites.filter((site) => !isDeletedSite(site));
}

function markSiteAsDeleted(siteId, snapshot = null) {
    const site = snapshot || LocalPlatformDataService.getById("sites", siteId) || {};
    const tombstone = {
        siteId,
        name: site.name || "",
        address: site.address || "",
        deletedAt: new Date().toISOString(),
    };
    const exists = getDeletedSiteTombstones().some((entry) =>
        siteMatchesTombstone(
            {
                id: tombstone.siteId,
                name: tombstone.name,
                address: tombstone.address,
            },
            entry
        )
    );

    if (!exists) {
        LocalPlatformDataService.create(SITE_DELETION_TOMBSTONES, tombstone);
    }
}

function clearSiteDeletionTombstone(site) {
    getDeletedSiteTombstones()
        .filter((tombstone) => siteMatchesTombstone(site, tombstone))
        .forEach((tombstone) => {
            LocalPlatformDataService.remove(SITE_DELETION_TOMBSTONES, tombstone.id);
        });
}

function refreshSiteActiveSensors(siteId) {
    if (!siteId) return;

    const site = LocalPlatformDataService.getById("sites", siteId);

    if (!site) return;

    const activeSensors = LocalPlatformDataService
        .list("sensors")
        .filter((sensor) => sensor.siteId === siteId && sensor.status === "active")
        .length;

    LocalPlatformDataService.update("sites", siteId, { activeSensors });
}

function getRelatedLocalSiteIds(siteId, snapshot = null) {
    const normalizedName = String(snapshot?.name || "").trim().toLowerCase();
    const normalizedAddress = String(snapshot?.address || "").trim().toLowerCase();
    const ids = LocalPlatformDataService
        .list("sites")
        .filter((site) => {
            const sameId = site.id === siteId;
            const sameName = normalizedName && String(site.name || "").trim().toLowerCase() === normalizedName;
            const sameAddress = normalizedAddress && String(site.address || "").trim().toLowerCase() === normalizedAddress;

            return sameId || sameName || sameAddress;
        })
        .map((site) => site.id);

    return ids.length ? ids : [siteId];
}

function upsertLocalSite(siteId, status, snapshot = null) {
    const attributes = {
        workplaceId: snapshot?.workplaceId || "WORKPLACE-001",
        name: snapshot?.name || "Sede seleccionada",
        address: snapshot?.address || "",
        type: snapshot?.type || "residential",
        status,
        waterConsumption: Number(snapshot?.waterConsumption || 0),
        gasConsumption: Number(snapshot?.gasConsumption || 0),
        activeSensors: Number(snapshot?.activeSensors || 0),
        activeIncidents: Number(snapshot?.activeIncidents || 0),
        latitude: snapshot?.latitude ?? null,
        longitude: snapshot?.longitude ?? null,
    };

    try {
        return LocalPlatformDataService.update("sites", siteId, attributes);
    } catch {
        return LocalPlatformDataService.create("sites", {
            id: siteId,
            ...attributes,
        });
    }
}

function normalizeSiteCollection(resources, type = "all") {
    const sites = siteAssembler.toEntities(resources || []);

    if (type && type !== "all") {
        return sites.filter((site) => site.type === type);
    }

    return sites;
}

function normalizePhysicalModel(resource) {
    if (!resource) return null;

    return {
        site: siteAssembler.toEntity(resource.site),
        rooms: (resource.rooms || []).map((room) => {
            const roomEntity = roomAssembler.toEntity(room);

            return {
                ...roomEntity,
                deviceGroups: (roomEntity.deviceGroups || []).map(enrichGroupWithLocalInventory),
            };
        }),
    };
}

export class WorkplaceApiService {
    async getWorkplace() {
        const workplaces = LocalPlatformDataService.list("workplaces");

        return workplaces[0] || null;
    }

    async getSites(type = "all") {
        return withBackendFallback(
            async () =>
                filterDeletedSites(
                    normalizeSiteCollection(await ApiClientService.get("/api/v1/sites"), type)
                ),
            () => {
                if (type && type !== "all") {
                    return filterDeletedSites(LocalPlatformDataService.list("sites", { type }));
                }

                return filterDeletedSites(LocalPlatformDataService.list("sites"));
            }
        );
    }

    async getSiteById(siteId) {
        return withBackendFallback(
            async () => {
                const site = siteAssembler.toEntity(await ApiClientService.get(`/api/v1/sites/${siteId}`));

                return isDeletedSite(site) ? null : site;
            },
            () => {
                const site = LocalPlatformDataService.getById("sites", siteId);

                return isDeletedSite(site) ? null : site;
            }
        );
    }

    async createSite(site) {
        return withBackendFallback(
            async () => {
                const createdSite = siteAssembler.toEntity(
                    await ApiClientService.post("/api/v1/sites", {
                        name: site.name,
                        address: site.address,
                        type: site.type || "residential",
                        status: site.status || "active",
                        latitude: site.latitude,
                        longitude: site.longitude,
                    })
                );

                clearSiteDeletionTombstone(createdSite);
                return createdSite;
            },
            () => {
                const createdSite = LocalPlatformDataService.create("sites", {
                    workplaceId: site.workplaceId || "WORKPLACE-001",
                    name: site.name,
                    address: site.address,
                    type: site.type || "residential",
                    status: site.status || "active",
                    waterConsumption: Number(site.waterConsumption || 0),
                    gasConsumption: Number(site.gasConsumption || 0),
                    activeSensors: Number(site.activeSensors || 0),
                    activeIncidents: Number(site.activeIncidents || 0),
                    latitude: site.latitude ?? null,
                    longitude: site.longitude ?? null,
                });

                clearSiteDeletionTombstone(createdSite);
                return createdSite;
            }
        );
    }

    async updateSiteStatus(siteId, status, snapshot = null) {
        const nextStatus = status === "inactive" ? "inactive" : "active";
        const targetSiteIds = getRelatedLocalSiteIds(siteId, snapshot);
        const site = upsertLocalSite(targetSiteIds[0], nextStatus, snapshot);
        const roomIds = LocalPlatformDataService
            .list("rooms")
            .filter((room) => targetSiteIds.includes(room.siteId))
            .map((room) => room.id);
        const deviceGroupIds = LocalPlatformDataService
            .list("deviceGroups")
            .filter((group) => roomIds.includes(group.roomId))
            .map((group) => group.id);

        if (nextStatus === "inactive") {
            updateLocalItems("sites", (localSite) => targetSiteIds.includes(localSite.id), { status: "inactive" });
            updateLocalItems("rooms", (room) => targetSiteIds.includes(room.siteId), { status: "inactive" });
            updateLocalItems("deviceGroups", (group) => deviceGroupIds.includes(group.id), { status: "inactive" });
            updateLocalItems("devices", (device) => targetSiteIds.includes(device.siteId), { status: "offline" });
            updateLocalItems("siteDeviceAssignments", (assignment) => targetSiteIds.includes(assignment.siteId), { status: "inactive" });
            updateLocalItems("sensors", (sensor) => targetSiteIds.includes(sensor.siteId), {
                status: "inactive",
                hasExceededThreshold: false,
            });
            updateLocalItems("valves", (valve) => targetSiteIds.includes(valve.siteId), {
                status: "closed",
                openingPercentage: 0,
            });

            return LocalPlatformDataService.update("sites", site.id, {
                status: "inactive",
                activeSensors: 0,
            });
        }

        updateLocalItems("sites", (localSite) => targetSiteIds.includes(localSite.id), { status: "active" });
        updateLocalItems("rooms", (room) => targetSiteIds.includes(room.siteId), { status: "active" });
        updateLocalItems("deviceGroups", (group) => deviceGroupIds.includes(group.id), { status: "active" });
        updateLocalItems("devices", (device) => targetSiteIds.includes(device.siteId), { status: "online" });
        updateLocalItems("siteDeviceAssignments", (assignment) => targetSiteIds.includes(assignment.siteId), { status: "active" });
        updateLocalItems("sensors", (sensor) => targetSiteIds.includes(sensor.siteId), { status: "active" });

        const activeSensors = LocalPlatformDataService
            .list("sensors")
            .filter((sensor) => targetSiteIds.includes(sensor.siteId))
            .filter((sensor) => sensor.status === "active")
            .length;

        return LocalPlatformDataService.update("sites", site.id, {
            status: "active",
            activeSensors,
        });
    }

    async deleteSite(siteId, snapshot = null) {
        const targetSiteIds = getRelatedLocalSiteIds(siteId, snapshot);
        markSiteAsDeleted(siteId, snapshot);

        try {
            await ApiClientService.delete(`/api/v1/sites/${siteId}`);
        } catch {
            // Local tombstone keeps the UI consistent when the demo backend has no delete endpoint.
        }

        const roomIds = LocalPlatformDataService
            .list("rooms")
            .filter((room) => targetSiteIds.includes(room.siteId))
            .map((room) => room.id);
        const deviceGroupIds = LocalPlatformDataService
            .list("deviceGroups")
            .filter((group) => roomIds.includes(group.roomId))
            .map((group) => group.id);
        const deviceIds = LocalPlatformDataService
            .list("devices")
            .filter((device) => targetSiteIds.includes(device.siteId) || deviceGroupIds.includes(device.deviceGroupId))
            .map((device) => device.id);
        const valveIds = LocalPlatformDataService
            .list("valves")
            .filter((valve) => targetSiteIds.includes(valve.siteId) || deviceIds.includes(valve.deviceId))
            .map((valve) => valve.id);
        const commandIds = LocalPlatformDataService
            .list("deviceCommands")
            .filter((command) =>
                targetSiteIds.includes(command.siteId) ||
                deviceIds.includes(command.deviceId) ||
                valveIds.includes(command.valveId)
            )
            .map((command) => command.id);

        removeLocalItems("siteMembers", (member) => targetSiteIds.includes(member.siteId));
        removeLocalItems("siteDeviceAssignments", (assignment) => targetSiteIds.includes(assignment.siteId) || deviceIds.includes(assignment.deviceId));
        removeLocalItems("sensors", (sensor) => targetSiteIds.includes(sensor.siteId) || deviceIds.includes(sensor.deviceId));
        removeLocalItems("valves", (valve) => targetSiteIds.includes(valve.siteId) || deviceIds.includes(valve.deviceId));
        removeLocalItems("devices", (device) => targetSiteIds.includes(device.siteId) || deviceIds.includes(device.id));
        removeLocalItems("deviceGroups", (group) => deviceGroupIds.includes(group.id));
        removeLocalItems("rooms", (room) => roomIds.includes(room.id));
        removeLocalItems("readings", (reading) => targetSiteIds.includes(reading.siteId));
        removeLocalItems("thresholds", (threshold) => targetSiteIds.includes(threshold.siteId));
        removeLocalItems("anomalies", (anomaly) => targetSiteIds.includes(anomaly.siteId));
        removeLocalItems("alerts", (alert) => targetSiteIds.includes(alert.siteId));
        removeLocalItems("incidents", (incident) => targetSiteIds.includes(incident.siteId));
        removeLocalItems("commands", (command) =>
            targetSiteIds.includes(command.siteId) ||
            deviceIds.includes(command.deviceId) ||
            valveIds.includes(command.valveId) ||
            commandIds.includes(command.id)
        );
        removeLocalItems("deviceCommands", (command) =>
            targetSiteIds.includes(command.siteId) ||
            deviceIds.includes(command.deviceId) ||
            valveIds.includes(command.valveId)
        );
        removeLocalItems("valveOperations", (operation) =>
            targetSiteIds.includes(operation.siteId) ||
            deviceIds.includes(operation.deviceId) ||
            valveIds.includes(operation.valveId)
        );
        removeLocalItems("commandExecutions", (execution) =>
            commandIds.includes(execution.commandId) ||
            commandIds.includes(execution.deviceCommandId)
        );
        removeLocalItems("commandAuditEntries", (entry) =>
            commandIds.includes(entry.commandId) ||
            commandIds.includes(entry.deviceCommandId)
        );
        removeLocalItems("sites", (site) => targetSiteIds.includes(site.id));

        return null;
    }

    async getRoomsBySite(siteId) {
        return withBackendFallback(
            async () =>
                roomAssembler.toEntities(
                    await ApiClientService.get(`/api/v1/sites/${siteId}/rooms`)
                ),
            () => {
                if (!siteId) {
                    return LocalPlatformDataService.list("rooms").map(buildRoomModel);
                }

                return LocalPlatformDataService.list("rooms", { siteId }).map(buildRoomModel);
            }
        );
    }

    async createRoom(room) {
        return withBackendFallback(
            async () =>
                roomAssembler.toEntity(
                    await ApiClientService.post(`/api/v1/sites/${room.siteId}/rooms`, {
                        name: room.name,
                        type: room.type || "custom",
                        status: room.status || "active",
                    })
                ),
            () => {
                const sameName = LocalPlatformDataService.list("rooms", {
                    siteId: room.siteId,
                }).some(
                    (entry) =>
                        entry.name.toLowerCase() === String(room.name || "").toLowerCase()
                );

                if (sameName) {
                    throw new Error("Ya existe un ambiente con ese nombre en la sede.");
                }

                return LocalPlatformDataService.create("rooms", {
                    siteId: room.siteId,
                    name: room.name,
                    type: room.type || "custom",
                    status: room.status || "active",
                });
            }
        );
    }

    async getDeviceGroupsByRoom(roomId) {
        return withBackendFallback(
            async () =>
                deviceGroupAssembler.toEntities(
                    await ApiClientService.get(`/api/v1/rooms/${roomId}/device-groups`)
                ),
            () => {
                if (!roomId) {
                    return LocalPlatformDataService.list("deviceGroups").map((group) => ({
                        ...group,
                        ...getDeviceGroupInventory(group.id),
                    }));
                }

                return LocalPlatformDataService.list("deviceGroups", { roomId }).map((group) => ({
                    ...group,
                    ...getDeviceGroupInventory(group.id),
                }));
            }
        );
    }

    async createDeviceGroup(deviceGroup) {
        return withBackendFallback(
            async () =>
                deviceGroupAssembler.toEntity(
                    await ApiClientService.post(
                        `/api/v1/rooms/${deviceGroup.roomId}/device-groups`,
                        {
                            name: deviceGroup.name,
                            resourceType: deviceGroup.resourceType || "mixed",
                            status: deviceGroup.status || "active",
                        }
                    )
                ),
            () => {
                const sameName = LocalPlatformDataService.list("deviceGroups", {
                    roomId: deviceGroup.roomId,
                }).some(
                    (entry) =>
                        entry.name.toLowerCase() === String(deviceGroup.name || "").toLowerCase()
                );

                if (sameName) {
                    throw new Error("Ya existe un grupo con ese nombre en el ambiente.");
                }

                return LocalPlatformDataService.create("deviceGroups", {
                    roomId: deviceGroup.roomId,
                    name: deviceGroup.name,
                    resourceType: deviceGroup.resourceType || "mixed",
                    status: deviceGroup.status || "active",
                });
            }
        );
    }

    async addDeviceToGroup(payload) {
        const { deviceGroup, room, site } = getDeviceGroupPlacement(payload);
        const resourceType = payload.resourceType || (deviceGroup.resourceType === "gas" ? "gas" : "water");
        const deviceType = payload.deviceType || "sensor";
        const siteIsInactive = site.status === "inactive";
        const selectedSensor = payload.sensorId
            ? LocalPlatformDataService.getById("sensors", payload.sensorId)
            : null;

        if (
            deviceType === "valve" &&
            (
                !selectedSensor ||
                selectedSensor.resourceType !== resourceType ||
                (
                    selectedSensor.deviceGroupId !== deviceGroup.id &&
                    !LocalPlatformDataService
                        .list("devices", { deviceGroupId: deviceGroup.id })
                        .some((entry) => entry.id === selectedSensor.deviceId)
                ) ||
                selectedSensor.status === "inactive"
            )
        ) {
            throw new Error(`Primero selecciona un sensor activo de ${getResourceName(resourceType)} para registrar esta valvula.`);
        }

        const device = LocalPlatformDataService.create("devices", {
            siteId: site.id,
            roomId: room.id,
            deviceGroupId: deviceGroup.id,
            name: payload.name,
            type: deviceType,
            status: siteIsInactive ? "offline" : "online",
            firmwareVersion: "2.8.1",
            lastSyncAt: new Date().toISOString(),
        });

        LocalPlatformDataService.create("siteDeviceAssignments", {
            siteId: site.id,
            deviceId: device.id,
            deviceName: device.name,
            deviceType,
            status: siteIsInactive ? "inactive" : "active",
        });

        if (deviceType === "valve") {
            const status = siteIsInactive ? "closed" : payload.valveStatus || "open";
            const valve = LocalPlatformDataService.create("valves", {
                deviceId: device.id,
                siteId: site.id,
                roomId: room.id,
                deviceGroupId: deviceGroup.id,
                name: payload.name,
                resourceType,
                sensorId: selectedSensor.id,
                sensorName: selectedSensor.name,
                status,
                openingPercentage: siteIsInactive ? 0 : status === "open" ? 100 : 0,
            });

            return {
                device,
                valve,
                sensor: null,
            };
        }

        const currentValue = Number(payload.currentValue || 0);
        const threshold = Number(payload.threshold || (resourceType === "gas" ? 120 : 300));
        const sensor = LocalPlatformDataService.create("sensors", {
            deviceId: device.id,
            siteId: site.id,
            roomId: room.id,
            deviceGroupId: deviceGroup.id,
            name: payload.name,
            resourceType,
            currentValue,
            unit: resourceType === "gas" ? "m3" : "L",
            threshold,
            status: siteIsInactive ? "inactive" : "active",
            hasExceededThreshold: siteIsInactive ? false : currentValue > threshold,
        });

        if (!siteIsInactive) {
            refreshSiteActiveSensors(site.id);
        }

        return {
            device,
            sensor,
            valve: null,
        };
    }

    async getPhysicalModelBySite(siteId) {
        return withBackendFallback(
            async () => {
                const model = normalizePhysicalModel(
                    await ApiClientService.get(`/api/v1/sites/${siteId}/physical-model`)
                );

                return isDeletedSite(model?.site) ? null : model;
            },
            async () => {
                const site = await this.getSiteById(siteId);

                if (!site) {
                    return null;
                }

                return {
                    site,
                    rooms: await this.getRoomsBySite(siteId),
                };
            }
        );
    }

    async assignMemberToSite(member) {
        const existingMember = LocalPlatformDataService
            .list("siteMembers", { siteId: member.siteId })
            .find((entry) => entry.email.toLowerCase() === String(member.email || "").toLowerCase());

        const memberData = {
            siteId: member.siteId,
            userId: member.userId,
            fullName: member.fullName,
            email: member.email,
            role: member.role || "operator",
        };

        if (existingMember) {
            return LocalPlatformDataService.update("siteMembers", existingMember.id, memberData);
        }

        return LocalPlatformDataService.create("siteMembers", memberData);
    }

    async assignDeviceToSite(assignment) {
        const existingAssignment = LocalPlatformDataService
            .list("siteDeviceAssignments", { siteId: assignment.siteId })
            .find((entry) => entry.deviceId === assignment.deviceId);

        const assignmentData = {
            siteId: assignment.siteId,
            deviceId: assignment.deviceId,
            deviceName: assignment.deviceName,
            deviceType: assignment.deviceType || "sensor",
            status: "active",
            responsibleMemberId: assignment.responsibleMemberId || "",
            responsibleName: assignment.responsibleName || "",
            responsibleEmail: assignment.responsibleEmail || "",
        };

        if (existingAssignment) {
            return LocalPlatformDataService.update(
                "siteDeviceAssignments",
                existingAssignment.id,
                assignmentData
            );
        }

        return LocalPlatformDataService.create("siteDeviceAssignments", assignmentData);
    }

    async removeMemberFromSite(memberId) {
        const member = LocalPlatformDataService.getById("siteMembers", memberId);

        if (!member) {
            throw new Error("No se encontro el responsable seleccionado.");
        }

        LocalPlatformDataService
            .list("siteDeviceAssignments", { siteId: member.siteId })
            .filter((assignment) => assignment.responsibleMemberId === member.id)
            .forEach((assignment) => {
                LocalPlatformDataService.update("siteDeviceAssignments", assignment.id, {
                    responsibleMemberId: "",
                    responsibleName: "",
                    responsibleEmail: "",
                });
            });

        LocalPlatformDataService.remove("siteMembers", member.id);

        return member;
    }

    async updateDeviceStatus(deviceId, status) {
        const device = LocalPlatformDataService.getById("devices", deviceId);

        if (!device) {
            throw new Error("No se encontro el equipo seleccionado.");
        }

        const nextStatus = status === "online" ? "online" : "offline";
        const site = device.siteId ? LocalPlatformDataService.getById("sites", device.siteId) : null;

        if (nextStatus === "online" && site?.status === "inactive") {
            throw new Error("Activa la sede antes de encender este equipo.");
        }

        const updatedDevice = LocalPlatformDataService.update("devices", device.id, {
            status: nextStatus,
            lastSyncAt: nextStatus === "online" ? new Date().toISOString() : device.lastSyncAt,
        });

        updateLocalItems(
            "siteDeviceAssignments",
            (assignment) => assignment.deviceId === device.id,
            { status: nextStatus === "online" ? "active" : "inactive" }
        );

        if (nextStatus === "offline") {
            const directSensors = LocalPlatformDataService
                .list("sensors")
                .filter((sensor) => sensor.deviceId === device.id);
            const directSensorIds = directSensors.map((sensor) => sensor.id);

            updateLocalItems(
                "sensors",
                (sensor) => sensor.deviceId === device.id,
                {
                    status: "inactive",
                    hasExceededThreshold: false,
                }
            );
            updateLocalItems(
                "valves",
                (valve) =>
                    valve.deviceId === device.id ||
                    directSensorIds.includes(valve.sensorId),
                {
                    status: "closed",
                    openingPercentage: 0,
                }
            );
        }

        refreshSiteActiveSensors(device.siteId);

        return updatedDevice;
    }

    async updateSensorStatus(sensorId, status) {
        const sensor = LocalPlatformDataService.getById("sensors", sensorId);

        if (!sensor) {
            throw new Error("No se encontro el sensor seleccionado.");
        }

        const nextStatus = status === "active" ? "active" : "inactive";
        const site = sensor.siteId ? LocalPlatformDataService.getById("sites", sensor.siteId) : null;
        const device = sensor.deviceId ? LocalPlatformDataService.getById("devices", sensor.deviceId) : null;

        if (nextStatus === "active" && site?.status === "inactive") {
            throw new Error("Activa la sede antes de encender este sensor.");
        }

        if (nextStatus === "active" && device?.status !== "online") {
            throw new Error("Activa el equipo antes de encender este sensor.");
        }

        const currentValue = Number(sensor.currentValue || 0);
        const threshold = Number(sensor.threshold || 0);
        const updatedSensor = LocalPlatformDataService.update("sensors", sensor.id, {
            status: nextStatus,
            hasExceededThreshold: nextStatus === "active" && threshold > 0 && currentValue > threshold,
        });

        if (nextStatus === "inactive") {
            updateLocalItems(
                "valves",
                (valve) => valve.sensorId === sensor.id,
                {
                    status: "closed",
                    openingPercentage: 0,
                }
            );
        }

        refreshSiteActiveSensors(sensor.siteId);

        return updatedSensor;
    }

    async removeSensorFromGroup(sensorId) {
        const sensor = LocalPlatformDataService.getById("sensors", sensorId);

        if (!sensor) {
            throw new Error("No se encontro el sensor seleccionado.");
        }

        const device = LocalPlatformDataService.getById("devices", sensor.deviceId);
        const site = sensor.siteId ? LocalPlatformDataService.getById("sites", sensor.siteId) : null;

        const linkedValves = LocalPlatformDataService
            .list("valves")
            .filter((valve) => valve.sensorId === sensor.id);
        const linkedValveIds = linkedValves.map((valve) => valve.id);
        const linkedValveDeviceIds = linkedValves
            .map((valve) => valve.deviceId)
            .filter(Boolean);
        const linkedCommandIds = LocalPlatformDataService
            .list("deviceCommands")
            .filter((command) => linkedValveIds.includes(command.valveId))
            .map((command) => command.id);

        removeLocalItems("commandExecutions", (execution) => linkedCommandIds.includes(execution.deviceCommandId));
        removeLocalItems("commandAuditEntries", (audit) => linkedCommandIds.includes(audit.deviceCommandId));
        removeLocalItems("deviceCommands", (command) => linkedCommandIds.includes(command.id));
        removeLocalItems("commands", (command) => linkedCommandIds.includes(command.id));
        removeLocalItems("valveOperations", (operation) => linkedValveIds.includes(operation.valveId));
        removeLocalItems("siteDeviceAssignments", (assignment) => linkedValveDeviceIds.includes(assignment.deviceId));
        removeLocalItems("devices", (entry) => linkedValveDeviceIds.includes(entry.id));
        removeLocalItems("valves", (valve) => linkedValveIds.includes(valve.id));
        LocalPlatformDataService.remove("sensors", sensor.id);

        if (device?.type === "sensor") {
            LocalPlatformDataService
                .list("siteDeviceAssignments")
                .filter((assignment) => assignment.deviceId === device.id)
                .forEach((assignment) => {
                    LocalPlatformDataService.remove("siteDeviceAssignments", assignment.id);
                });

            LocalPlatformDataService.remove("devices", device.id);
        }

        if (site) {
            refreshSiteActiveSensors(site.id);
        }

        return sensor;
    }

    async removeDeviceFromGroup(deviceId) {
        const device = LocalPlatformDataService.getById("devices", deviceId);

        if (!device) {
            throw new Error("No se encontro el equipo seleccionado.");
        }

        const directSensors = LocalPlatformDataService
            .list("sensors")
            .filter((sensor) => sensor.deviceId === device.id);
        const directSensorIds = directSensors.map((sensor) => sensor.id);
        const relatedValves = LocalPlatformDataService
            .list("valves")
            .filter(
                (valve) =>
                    valve.deviceId === device.id ||
                    directSensorIds.includes(valve.sensorId)
            );
        const relatedValveIds = relatedValves.map((valve) => valve.id);
        const relatedValveDeviceIds = relatedValves
            .map((valve) => valve.deviceId)
            .filter(Boolean);
        const deviceIdsToRemove = Array.from(new Set([device.id, ...relatedValveDeviceIds]));
        const commandIds = LocalPlatformDataService
            .list("deviceCommands")
            .filter(
                (command) =>
                    deviceIdsToRemove.includes(command.deviceId) ||
                    relatedValveIds.includes(command.valveId)
            )
            .map((command) => command.id);

        removeLocalItems("commandExecutions", (execution) => commandIds.includes(execution.deviceCommandId));
        removeLocalItems("commandAuditEntries", (audit) => commandIds.includes(audit.deviceCommandId));
        removeLocalItems(
            "valveOperations",
            (operation) =>
                deviceIdsToRemove.includes(operation.deviceId) ||
                relatedValveIds.includes(operation.valveId)
        );
        removeLocalItems("deviceCommands", (command) => commandIds.includes(command.id));
        removeLocalItems("commands", (command) => commandIds.includes(command.id));
        removeLocalItems("siteDeviceAssignments", (assignment) => deviceIdsToRemove.includes(assignment.deviceId));
        removeLocalItems(
            "valves",
            (valve) =>
                relatedValveIds.includes(valve.id) ||
                deviceIdsToRemove.includes(valve.deviceId)
        );
        removeLocalItems(
            "sensors",
            (sensor) =>
                directSensorIds.includes(sensor.id) ||
                deviceIdsToRemove.includes(sensor.deviceId)
        );
        removeLocalItems("devices", (entry) => deviceIdsToRemove.includes(entry.id));
        refreshSiteActiveSensors(device.siteId);

        return device;
    }

    async getMembersBySite(siteId) {
        if (!siteId) {
            return LocalPlatformDataService.list("siteMembers");
        }

        return LocalPlatformDataService.list("siteMembers", { siteId });
    }

    async getAssignmentsBySite(siteId) {
        if (!siteId) {
            return LocalPlatformDataService.list("siteDeviceAssignments");
        }

        return LocalPlatformDataService.list("siteDeviceAssignments", { siteId });
    }

    async getSummary() {
        return withBackendFallback(
            async () => {
                const sites = await this.getSites();
                const physicalModels = await Promise.all(
                    sites.map((site) => this.getPhysicalModelBySite(site.id))
                );
                const rooms = physicalModels.flatMap((model) => model?.rooms || []);
                const deviceGroups = rooms.flatMap((room) => room.deviceGroups || []);
                const devices = deviceGroups.flatMap((group) => group.devices || []);
                const totals = getSiteTotals(sites);

                return {
                    totalSites: sites.length,
                    activeSites: sites.filter((site) => site.status === "active").length,
                    maintenanceSites: sites.filter((site) => site.status === "maintenance").length,
                    totalRooms: rooms.length,
                    maintenanceRooms: rooms.filter((room) => room.status === "maintenance").length,
                    totalDeviceGroups: deviceGroups.length,
                    maintenanceDeviceGroups: deviceGroups.filter((group) => group.status === "maintenance").length,
                    totalDevices: devices.length,
                    totalMembers: LocalPlatformDataService.list("siteMembers").length,
                    totalDeviceAssignments: LocalPlatformDataService.list("siteDeviceAssignments").length,
                    ...totals,
                };
            },
            () => {
                const sites = filterDeletedSites(LocalPlatformDataService.list("sites"));
                const siteIds = sites.map((site) => site.id);
                const rooms = LocalPlatformDataService
                    .list("rooms")
                    .filter((room) => siteIds.includes(room.siteId));
                const roomIds = rooms.map((room) => room.id);
                const deviceGroups = LocalPlatformDataService
                    .list("deviceGroups")
                    .filter((group) => roomIds.includes(group.roomId));
                const deviceGroupIds = deviceGroups.map((group) => group.id);
                const devices = LocalPlatformDataService
                    .list("devices")
                    .filter((device) =>
                        siteIds.includes(device.siteId) ||
                        deviceGroupIds.includes(device.deviceGroupId)
                    );
                const deviceIds = devices.map((device) => device.id);
                const members = LocalPlatformDataService
                    .list("siteMembers")
                    .filter((member) => siteIds.includes(member.siteId));
                const assignments = LocalPlatformDataService
                    .list("siteDeviceAssignments")
                    .filter((assignment) =>
                        siteIds.includes(assignment.siteId) ||
                        deviceIds.includes(assignment.deviceId)
                    );
                const totals = getSiteTotals(sites);

                return {
                    totalSites: sites.length,
                    activeSites: sites.filter((site) => site.status === "active").length,
                    maintenanceSites: sites.filter((site) => site.status === "maintenance").length,
                    totalRooms: rooms.length,
                    maintenanceRooms: rooms.filter((room) => room.status === "maintenance").length,
                    totalDeviceGroups: deviceGroups.length,
                    maintenanceDeviceGroups: deviceGroups.filter((group) => group.status === "maintenance").length,
                    totalDevices: devices.length,
                    totalMembers: members.length,
                    totalDeviceAssignments: assignments.length,
                    ...totals,
                };
            }
        );
    }
}
