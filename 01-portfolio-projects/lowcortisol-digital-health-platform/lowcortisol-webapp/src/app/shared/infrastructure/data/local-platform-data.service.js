import { LocalStorageService } from "../storage/local-storage.service";

const STORAGE_KEY = "lowcortisol.platform.local-data.v1";
const LOCAL_DATA_VERSION = "operational-live-meter-v1";

const idPrefixes = {
    users: "USR",
    accessProfiles: "PROFILE",
    workplaces: "WORKPLACE",
    sites: "SITE",
    siteDeletionTombstones: "SITEDEL",
    rooms: "ROOM",
    deviceGroups: "GROUP",
    siteMembers: "MEMBER",
    siteDeviceAssignments: "ASSIGN",
    devices: "DEV",
    sensors: "SEN",
    valves: "VALVE",
    commands: "CMD",
    deviceCommands: "CMD",
    valveOperations: "VOP",
    commandExecutions: "EXEC",
    commandAuditEntries: "AUDIT",
    monitoringSessions: "SESSION",
    readings: "READ",
    anomalies: "ANOM",
    reports: "REPORT",
    alerts: "ALERT",
    thresholds: "THR",
    incidents: "INC",
    incidentActions: "ACTION",
    incidentAssignments: "INCASSIGN",
    notificationChannels: "CHANNEL",
    alertDeliveries: "DELIVERY",
    plans: "PLAN",
    subscriptions: "SUB",
    payments: "PAY",
    serviceRequests: "REQ",
    supportTickets: "TICKET",
    supportMessages: "MSG",
    supportAgents: "AGENT",
    knowledgeArticles: "ARTICLE",
    supportConversations: "CONV",
};

const seededSiteIds = new Set(["SITE-001", "SITE-002", "SITE-003"]);

function now() {
    return new Date().toISOString();
}

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function createId(collectionName) {
    const prefix = idPrefixes[collectionName] || "ITEM";
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return `${prefix}-${suffix}`;
}

function matchesFilters(item, filters = {}) {
    return Object.entries(filters).every(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return true;
        }

        return item[key] === value;
    });
}

function normalizeLookupText(value) {
    return String(value || "").trim().toLowerCase();
}

function siteMatchesDeletionTombstone(site, tombstone) {
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

function siteIsFromInitialCatalog(site) {
    return Boolean(site?.id && seededSiteIds.has(site.id));
}

function removeItems(data, collectionName, predicate) {
    const collection = data[collectionName] || [];
    const filteredCollection = collection.filter((item) => !predicate(item));
    const changed = filteredCollection.length !== collection.length;

    if (changed) {
        data[collectionName] = filteredCollection;
    }

    return changed;
}

function purgeDeletedSiteArtifacts(data) {
    const tombstones = Array.isArray(data.siteDeletionTombstones)
        ? data.siteDeletionTombstones
        : [];
    const tombstonedSiteIds = new Set(
        tombstones.map((tombstone) => tombstone.siteId).filter(Boolean)
    );
    const hasUserCatalog = (data.sites || []).some(
        (site) => site?.id && !siteIsFromInitialCatalog(site)
    );

    if (hasUserCatalog) {
        (data.sites || [])
            .filter(siteIsFromInitialCatalog)
            .forEach((site) => {
                tombstonedSiteIds.add(site.id);
            });
    }

    (data.sites || []).forEach((site) => {
        if (tombstones.some((tombstone) => siteMatchesDeletionTombstone(site, tombstone))) {
            tombstonedSiteIds.add(site.id);
        }
    });

    const visibleSiteIds = new Set(
        (data.sites || [])
            .filter((site) => !tombstonedSiteIds.has(site.id))
            .map((site) => site.id)
    );
    const shouldRemoveSiteId = (siteId) =>
        Boolean(siteId) && (tombstonedSiteIds.has(siteId) || !visibleSiteIds.has(siteId));
    const roomIds = new Set(
        (data.rooms || [])
            .filter((room) => shouldRemoveSiteId(room.siteId))
            .map((room) => room.id)
    );
    const deviceGroupIds = new Set(
        (data.deviceGroups || [])
            .filter((group) => roomIds.has(group.roomId))
            .map((group) => group.id)
    );
    const deviceIds = new Set(
        (data.devices || [])
            .filter((device) =>
                shouldRemoveSiteId(device.siteId) ||
                roomIds.has(device.roomId) ||
                deviceGroupIds.has(device.deviceGroupId)
            )
            .map((device) => device.id)
    );
    const sensorIds = new Set(
        (data.sensors || [])
            .filter((sensor) =>
                shouldRemoveSiteId(sensor.siteId) ||
                roomIds.has(sensor.roomId) ||
                deviceGroupIds.has(sensor.deviceGroupId) ||
                deviceIds.has(sensor.deviceId)
            )
            .map((sensor) => sensor.id)
    );
    const valveIds = new Set(
        (data.valves || [])
            .filter((valve) =>
                shouldRemoveSiteId(valve.siteId) ||
                roomIds.has(valve.roomId) ||
                deviceGroupIds.has(valve.deviceGroupId) ||
                deviceIds.has(valve.deviceId) ||
                sensorIds.has(valve.sensorId)
            )
            .map((valve) => valve.id)
    );

    (data.valves || []).forEach((valve) => {
        if (valveIds.has(valve.id) && valve.deviceId) {
            deviceIds.add(valve.deviceId);
        }
    });

    (data.devices || []).forEach((device) => {
        if (valveIds.has(device.valveId) || sensorIds.has(device.sensorId)) {
            deviceIds.add(device.id);
        }
    });

    (data.sensors || []).forEach((sensor) => {
        if (deviceIds.has(sensor.deviceId)) {
            sensorIds.add(sensor.id);
        }
    });

    (data.valves || []).forEach((valve) => {
        if (deviceIds.has(valve.deviceId) || sensorIds.has(valve.sensorId)) {
            valveIds.add(valve.id);
        }
    });

    const incidentIds = new Set(
        (data.incidents || [])
            .filter((incident) =>
                shouldRemoveSiteId(incident.siteId) ||
                roomIds.has(incident.roomId) ||
                deviceGroupIds.has(incident.deviceGroupId) ||
                deviceIds.has(incident.deviceId) ||
                sensorIds.has(incident.sensorId)
            )
            .map((incident) => incident.id)
    );
    const commandIds = new Set(
        [...(data.deviceCommands || []), ...(data.commands || [])]
            .filter((command) =>
                shouldRemoveSiteId(command.siteId) ||
                roomIds.has(command.roomId) ||
                deviceGroupIds.has(command.deviceGroupId) ||
                deviceIds.has(command.deviceId) ||
                valveIds.has(command.valveId) ||
                incidentIds.has(command.incidentId)
            )
            .map((command) => command.id)
            .filter(Boolean)
    );
    let changed = false;

    changed = removeItems(data, "sites", (site) => tombstonedSiteIds.has(site.id)) || changed;
    changed = removeItems(data, "rooms", (room) =>
        shouldRemoveSiteId(room.siteId) || roomIds.has(room.id)
    ) || changed;
    changed = removeItems(data, "deviceGroups", (group) =>
        roomIds.has(group.roomId) || deviceGroupIds.has(group.id)
    ) || changed;
    changed = removeItems(data, "devices", (device) =>
        shouldRemoveSiteId(device.siteId) ||
        roomIds.has(device.roomId) ||
        deviceGroupIds.has(device.deviceGroupId) ||
        deviceIds.has(device.id) ||
        valveIds.has(device.valveId) ||
        sensorIds.has(device.sensorId)
    ) || changed;
    changed = removeItems(data, "sensors", (sensor) =>
        shouldRemoveSiteId(sensor.siteId) ||
        roomIds.has(sensor.roomId) ||
        deviceGroupIds.has(sensor.deviceGroupId) ||
        deviceIds.has(sensor.deviceId) ||
        sensorIds.has(sensor.id)
    ) || changed;
    changed = removeItems(data, "valves", (valve) =>
        shouldRemoveSiteId(valve.siteId) ||
        roomIds.has(valve.roomId) ||
        deviceGroupIds.has(valve.deviceGroupId) ||
        deviceIds.has(valve.deviceId) ||
        sensorIds.has(valve.sensorId) ||
        valveIds.has(valve.id)
    ) || changed;
    changed = removeItems(data, "siteMembers", (member) => shouldRemoveSiteId(member.siteId)) || changed;
    changed = removeItems(data, "siteDeviceAssignments", (assignment) =>
        shouldRemoveSiteId(assignment.siteId) || deviceIds.has(assignment.deviceId)
    ) || changed;
    changed = removeItems(data, "readings", (reading) =>
        shouldRemoveSiteId(reading.siteId) ||
        roomIds.has(reading.roomId) ||
        deviceGroupIds.has(reading.deviceGroupId) ||
        deviceIds.has(reading.deviceId) ||
        sensorIds.has(reading.sensorId)
    ) || changed;
    changed = removeItems(data, "thresholds", (threshold) =>
        shouldRemoveSiteId(threshold.siteId) ||
        roomIds.has(threshold.roomId) ||
        deviceGroupIds.has(threshold.deviceGroupId) ||
        deviceIds.has(threshold.deviceId) ||
        sensorIds.has(threshold.sensorId)
    ) || changed;
    changed = removeItems(data, "anomalies", (anomaly) =>
        shouldRemoveSiteId(anomaly.siteId) ||
        roomIds.has(anomaly.roomId) ||
        deviceGroupIds.has(anomaly.deviceGroupId) ||
        deviceIds.has(anomaly.deviceId) ||
        sensorIds.has(anomaly.sensorId)
    ) || changed;
    changed = removeItems(data, "alerts", (alert) =>
        shouldRemoveSiteId(alert.siteId) ||
        roomIds.has(alert.roomId) ||
        deviceGroupIds.has(alert.deviceGroupId) ||
        deviceIds.has(alert.deviceId) ||
        sensorIds.has(alert.sensorId)
    ) || changed;
    changed = removeItems(data, "incidents", (incident) =>
        shouldRemoveSiteId(incident.siteId) ||
        roomIds.has(incident.roomId) ||
        deviceGroupIds.has(incident.deviceGroupId) ||
        deviceIds.has(incident.deviceId) ||
        sensorIds.has(incident.sensorId) ||
        incidentIds.has(incident.id)
    ) || changed;
    changed = removeItems(data, "incidentActions", (action) => incidentIds.has(action.incidentId)) || changed;
    changed = removeItems(data, "incidentAssignments", (assignment) => incidentIds.has(assignment.incidentId)) || changed;
    changed = removeItems(data, "commands", (command) =>
        commandIds.has(command.id) ||
        shouldRemoveSiteId(command.siteId) ||
        roomIds.has(command.roomId) ||
        deviceGroupIds.has(command.deviceGroupId) ||
        deviceIds.has(command.deviceId) ||
        valveIds.has(command.valveId)
    ) || changed;
    changed = removeItems(data, "deviceCommands", (command) =>
        commandIds.has(command.id) ||
        shouldRemoveSiteId(command.siteId) ||
        roomIds.has(command.roomId) ||
        deviceGroupIds.has(command.deviceGroupId) ||
        deviceIds.has(command.deviceId) ||
        valveIds.has(command.valveId)
    ) || changed;
    changed = removeItems(data, "valveOperations", (operation) =>
        shouldRemoveSiteId(operation.siteId) ||
        roomIds.has(operation.roomId) ||
        deviceGroupIds.has(operation.deviceGroupId) ||
        deviceIds.has(operation.deviceId) ||
        valveIds.has(operation.valveId) ||
        incidentIds.has(operation.incidentId)
    ) || changed;
    changed = removeItems(data, "commandExecutions", (execution) =>
        commandIds.has(execution.commandId) || commandIds.has(execution.deviceCommandId)
    ) || changed;
    changed = removeItems(data, "commandAuditEntries", (entry) =>
        commandIds.has(entry.commandId) || commandIds.has(entry.deviceCommandId)
    ) || changed;
    changed = removeItems(data, "reports", (report) => shouldRemoveSiteId(report.siteId)) || changed;
    changed = removeItems(data, "serviceRequests", (request) => shouldRemoveSiteId(request.siteId)) || changed;
    changed = removeItems(data, "supportTickets", (ticket) => shouldRemoveSiteId(ticket.siteId)) || changed;
    changed = removeItems(data, "monitoringSessions", (session) => shouldRemoveSiteId(session.siteId)) || changed;

    return changed;
}

function resetOperationalData(data) {
    [
        "readings",
        "anomalies",
        "reports",
        "alerts",
        "thresholds",
        "incidents",
        "incidentActions",
        "incidentAssignments",
        "alertDeliveries",
        "commands",
        "deviceCommands",
        "valveOperations",
        "commandExecutions",
        "commandAuditEntries",
        "monitoringSessions",
    ].forEach((collectionName) => {
        data[collectionName] = [];
    });

    data.sites = (data.sites || []).map((site) => ({
        ...site,
        waterConsumption: 0,
        gasConsumption: 0,
        activeIncidents: 0,
    }));

    data.sensors = (data.sensors || []).map((sensor) => ({
        ...sensor,
        currentValue: 0,
        hasExceededThreshold: false,
    }));

    data.devices = (data.devices || []).map((device) => {
        if (device.type !== "conduit") return device;

        return {
            ...device,
            flowStatus: "stopped",
            lastConsumptionValue: 0,
            lastFlowRate: 0,
            totalConsumption: 0,
            lastActivatedAt: null,
            lastStoppedAt: null,
            lastMeteredAt: null,
        };
    });

    return {
        ...data,
        localDataVersion: LOCAL_DATA_VERSION,
    };
}

function buildInitialData() {
    const createdAt = "2026-06-13T18:00:00.000Z";

    return {
        localDataVersion: LOCAL_DATA_VERSION,
        users: [
            {
                id: "USR-001",
                fullName: "Jean Loa",
                email: "demo@lowcortisol.com",
                phone: "+51 999 888 777",
                password: "123456",
                status: "active",
                accessProfileId: "PROFILE-OWNER",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        accessProfiles: [
            {
                id: "PROFILE-OWNER",
                role: "owner",
                permissions: [
                    "monitoring:read",
                    "workplace:manage",
                    "devices:operate",
                    "alerts:resolve",
                    "reports:generate",
                    "plans:manage",
                    "support:write",
                ],
                createdAt,
                updatedAt: createdAt,
            },
        ],
        workplaces: [
            {
                id: "WORKPLACE-001",
                ownerId: "USR-001",
                name: "LowCortisol Operations",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        sites: [
            {
                id: "SITE-001",
                workplaceId: "WORKPLACE-001",
                name: "Residencial Miraflores",
                address: "Av. La Paz 1240, Lima",
                type: "residential",
                status: "active",
                waterConsumption: 0,
                gasConsumption: 0,
                activeSensors: 6,
                activeIncidents: 0,
                latitude: -12.11962,
                longitude: -77.03599,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "SITE-002",
                workplaceId: "WORKPLACE-001",
                name: "Centro Empresarial Norte",
                address: "Calle Los Robles 560, San Isidro",
                type: "business",
                status: "maintenance",
                waterConsumption: 0,
                gasConsumption: 0,
                activeSensors: 4,
                activeIncidents: 0,
                latitude: -12.09611,
                longitude: -77.03653,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "SITE-003",
                workplaceId: "WORKPLACE-001",
                name: "Planta Callao",
                address: "Zona industrial 18, Callao",
                type: "industrial",
                status: "active",
                waterConsumption: 0,
                gasConsumption: 0,
                activeSensors: 9,
                activeIncidents: 0,
                latitude: -12.05085,
                longitude: -77.12598,
                createdAt,
                updatedAt: createdAt,
            },
        ],
        siteMembers: [
            {
                id: "MEMBER-001",
                siteId: "SITE-001",
                userId: "USR-001",
                fullName: "Jean Loa",
                email: "demo@lowcortisol.com",
                role: "owner",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "MEMBER-002",
                siteId: "SITE-002",
                userId: "USR-002",
                fullName: "Mariana Torres",
                email: "mariana@lowcortisol.com",
                role: "operator",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "MEMBER-003",
                siteId: "SITE-003",
                userId: "USR-003",
                fullName: "Rafael Paredes",
                email: "rafael@lowcortisol.com",
                role: "admin",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        siteDeviceAssignments: [
            {
                id: "ASSIGN-001",
                siteId: "SITE-001",
                deviceId: "DEV-HUB-001",
                deviceName: "Hub Miraflores",
                deviceType: "hub",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "ASSIGN-002",
                siteId: "SITE-002",
                deviceId: "DEV-HUB-002",
                deviceName: "Hub Empresarial Norte",
                deviceType: "hub",
                status: "maintenance",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "ASSIGN-003",
                siteId: "SITE-003",
                deviceId: "DEV-HUB-003",
                deviceName: "Hub Planta Callao",
                deviceType: "hub",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        siteDeletionTombstones: [],
        rooms: [
            {
                id: "ROOM-001",
                siteId: "SITE-001",
                name: "Zona Cocina",
                type: "kitchen",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "ROOM-002",
                siteId: "SITE-001",
                name: "Torre A",
                type: "custom",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "ROOM-003",
                siteId: "SITE-002",
                name: "Sala de maquinas",
                type: "engine_room",
                status: "maintenance",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "ROOM-004",
                siteId: "SITE-003",
                name: "Linea industrial",
                type: "warehouse",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        deviceGroups: [
            {
                id: "GROUP-001",
                roomId: "ROOM-001",
                name: "Grupo Gas Principal",
                resourceType: "gas",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "GROUP-002",
                roomId: "ROOM-002",
                name: "Grupo Agua Torre A",
                resourceType: "water",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "GROUP-003",
                roomId: "ROOM-003",
                name: "Grupo Mixto Sala Tecnica",
                resourceType: "mixed",
                status: "maintenance",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "GROUP-004",
                roomId: "ROOM-004",
                name: "Grupo Gas Industrial",
                resourceType: "gas",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        devices: [
            {
                id: "DEV-HUB-001",
                siteId: "SITE-001",
                roomId: "ROOM-001",
                deviceGroupId: "GROUP-001",
                name: "Hub Miraflores",
                type: "hub",
                status: "online",
                firmwareVersion: "2.8.1",
                lastSyncAt: "2026-06-13T17:44:00.000Z",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "DEV-HUB-002",
                siteId: "SITE-002",
                roomId: "ROOM-003",
                deviceGroupId: "GROUP-003",
                name: "Hub Empresarial Norte",
                type: "hub",
                status: "maintenance",
                firmwareVersion: "2.7.4",
                lastSyncAt: "2026-06-13T15:20:00.000Z",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "DEV-HUB-003",
                siteId: "SITE-003",
                roomId: "ROOM-004",
                deviceGroupId: "GROUP-004",
                name: "Hub Planta Callao",
                type: "hub",
                status: "online",
                firmwareVersion: "2.8.1",
                lastSyncAt: "2026-06-13T17:58:00.000Z",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        sensors: [
            {
                id: "SEN-WATER-001",
                deviceId: "DEV-HUB-001",
                siteId: "SITE-001",
                name: "Sensor agua torre A",
                resourceType: "water",
                currentValue: 0,
                unit: "L",
                threshold: 320,
                status: "active",
                hasExceededThreshold: false,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "SEN-GAS-001",
                deviceId: "DEV-HUB-001",
                siteId: "SITE-001",
                name: "Sensor gas cocina central",
                resourceType: "gas",
                currentValue: 0,
                unit: "m3",
                threshold: 120,
                status: "active",
                hasExceededThreshold: false,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "SEN-WATER-002",
                deviceId: "DEV-HUB-002",
                siteId: "SITE-002",
                name: "Sensor agua oficinas",
                resourceType: "water",
                currentValue: 0,
                unit: "L",
                threshold: 300,
                status: "active",
                hasExceededThreshold: false,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "SEN-GAS-003",
                deviceId: "DEV-HUB-003",
                siteId: "SITE-003",
                name: "Sensor gas linea industrial",
                resourceType: "gas",
                currentValue: 0,
                unit: "m3",
                threshold: 140,
                status: "active",
                hasExceededThreshold: false,
                createdAt,
                updatedAt: createdAt,
            },
        ],
        valves: [
            {
                id: "VALVE-WATER-001",
                deviceId: "DEV-HUB-001",
                siteId: "SITE-001",
                name: "Valvula agua torre A",
                resourceType: "water",
                status: "open",
                openingPercentage: 76,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "VALVE-GAS-001",
                deviceId: "DEV-HUB-001",
                siteId: "SITE-001",
                name: "Valvula gas cocina central",
                resourceType: "gas",
                status: "closed",
                openingPercentage: 0,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "VALVE-GAS-003",
                deviceId: "DEV-HUB-003",
                siteId: "SITE-003",
                name: "Valvula gas linea industrial",
                resourceType: "gas",
                status: "open",
                openingPercentage: 64,
                createdAt,
                updatedAt: createdAt,
            },
        ],
        commands: [],
        deviceCommands: [],
        valveOperations: [],
        commandExecutions: [],
        commandAuditEntries: [],
        monitoringSessions: [],
        readings: [],
        anomalies: [],
        reports: [],
        alerts: [],
        thresholds: [],
        incidents: [],
        notificationChannels: [
            {
                id: "CHANNEL-001",
                name: "Panel interno",
                type: "in_app",
                isActive: true,
                enabled: true,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "CHANNEL-002",
                name: "Correo operativo",
                type: "email",
                isActive: false,
                enabled: true,
                createdAt,
                updatedAt: createdAt,
            },
        ],
        alertDeliveries: [],
        incidentActions: [],
        incidentAssignments: [],
        plans: [
            {
                id: "PLAN-ESSENTIAL",
                name: "Essential",
                description: "Para monitoreo inicial de una sede.",
                price: 49,
                currency: "PEN",
                billingPeriod: "monthly",
                maxSites: 1,
                maxDevices: 5,
                recommended: false,
                features: [
                    { id: "FEATURE-ESS-001", name: "Monitoreo de agua y gas" },
                    { id: "FEATURE-ESS-002", name: "Alertas operativas" },
                    { id: "FEATURE-ESS-003", name: "Soporte por ticket" },
                ],
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "PLAN-PRO",
                name: "Professional",
                description: "Para equipos que operan varias sedes.",
                price: 129,
                currency: "PEN",
                billingPeriod: "monthly",
                maxSites: 5,
                maxDevices: 35,
                recommended: true,
                features: [
                    { id: "FEATURE-PRO-001", name: "Sedes y dispositivos ampliados" },
                    { id: "FEATURE-PRO-002", name: "Reportes de consumo" },
                    { id: "FEATURE-PRO-003", name: "Canales de alerta configurables" },
                ],
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "PLAN-ENTERPRISE",
                name: "Enterprise",
                description: "Para operaciones con alta criticidad.",
                price: 299,
                currency: "PEN",
                billingPeriod: "monthly",
                maxSites: 25,
                maxDevices: 250,
                recommended: false,
                features: [
                    { id: "FEATURE-ENT-001", name: "Operacion multi sede" },
                    { id: "FEATURE-ENT-002", name: "Alertas prioritarias" },
                    { id: "FEATURE-ENT-003", name: "Soporte operativo avanzado" },
                ],
                createdAt,
                updatedAt: createdAt,
            },
        ],
        subscriptions: [
            {
                id: "SUB-001",
                userId: "USR-001",
                workplaceId: "WORKPLACE-001",
                planId: "PLAN-PRO",
                status: "active",
                startedAt: "2026-06-01T00:00:00.000Z",
                expiresAt: null,
                autoRenew: true,
                createdAt,
                updatedAt: createdAt,
            },
        ],
        payments: [
            {
                id: "PAY-001",
                subscriptionId: "SUB-001",
                amount: 129,
                currency: "PEN",
                method: "card",
                status: "paid",
                paidAt: "2026-06-01T09:00:00.000Z",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        serviceRequests: [
            {
                id: "REQ-001",
                subscriptionId: "SUB-001",
                type: "support",
                description: "Revision de capacidad para nueva sede.",
                status: "resolved",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        supportTickets: [
            {
                id: "TICKET-001",
                userId: "USR-001",
                siteId: "SITE-001",
                title: "Revision de sensor de gas",
                description: "El sensor de gas reporta lecturas altas durante picos de uso.",
                category: "device",
                priority: "high",
                status: "assigned",
                assignedAgentId: "AGENT-002",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "TICKET-002",
                userId: "USR-001",
                siteId: "SITE-003",
                title: "Reporte mensual de planta",
                description: "Solicito apoyo para interpretar el reporte de consumo mensual.",
                category: "technical",
                priority: "medium",
                status: "open",
                assignedAgentId: "",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        supportMessages: [
            {
                id: "MSG-001",
                ticketId: "TICKET-001",
                senderId: "USR-001",
                senderType: "user",
                content: "Necesitamos validar si la lectura corresponde a consumo real.",
                status: "sent",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "MSG-002",
                ticketId: "TICKET-001",
                senderId: "AGENT-002",
                senderType: "agent",
                content: "Revisaremos sensor, valvula y limite asociado a la sede.",
                status: "sent",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        supportAgents: [
            {
                id: "AGENT-001",
                fullName: "Lucia Ramos",
                status: "available",
                specialty: "Monitoreo",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "AGENT-002",
                fullName: "Mateo Silva",
                status: "busy",
                specialty: "Dispositivos",
                createdAt,
                updatedAt: createdAt,
            },
        ],
        knowledgeArticles: [
            {
                id: "ARTICLE-001",
                title: "Como interpretar una alerta critica",
                summary: "Guia para priorizar eventos de agua y gas con impacto operativo.",
                category: "alerts",
                helpfulCount: 24,
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "ARTICLE-002",
                title: "Buenas practicas para sensores",
                summary: "Recomendaciones para mantener lecturas estables en sedes activas.",
                category: "device",
                helpfulCount: 18,
                createdAt,
                updatedAt: createdAt,
            },
        ],
        supportConversations: [
            {
                id: "CONV-001",
                ticketId: "TICKET-001",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
            {
                id: "CONV-002",
                ticketId: "TICKET-002",
                status: "active",
                createdAt,
                updatedAt: createdAt,
            },
        ],
    };
}

function ensureDataShape(data) {
    const initialData = buildInitialData();
    let changed = false;

    if (data.localDataVersion !== LOCAL_DATA_VERSION) {
        data = resetOperationalData(data);
        changed = true;
    }

    [
        "rooms",
        "deviceGroups",
        "siteDeletionTombstones",
        "incidentActions",
        "incidentAssignments",
        "deviceCommands",
        "valveOperations",
        "commandExecutions",
        "commandAuditEntries",
    ].forEach((collectionName) => {
        if (!Array.isArray(data[collectionName])) {
            data[collectionName] = initialData[collectionName];
            changed = true;
        }
    });

    data.sites = (data.sites || initialData.sites).map((site) => {
        const initialSite = initialData.sites.find((entry) => entry.id === site.id);
        const latitude = site.latitude ?? initialSite?.latitude ?? null;
        const longitude = site.longitude ?? initialSite?.longitude ?? null;

        if (latitude !== site.latitude || longitude !== site.longitude) {
            changed = true;
        }

        return {
            ...site,
            latitude,
            longitude,
        };
    });

    if (!Array.isArray(data.deviceCommands) || data.deviceCommands.length === 0) {
        data.deviceCommands = (data.commands || []).map((command) => ({
            ...command,
            valveId: command.valveId || "",
            siteId: command.siteId || "",
            roomId: command.roomId || "",
            deviceGroupId: command.deviceGroupId || "",
            incidentId: command.incidentId || "",
            source: command.source || "manual",
            reason: command.reason || "",
            requestedBy: command.requestedBy || "Operations",
            requestedAt: command.requestedAt || command.createdAt || now(),
            executedAt: command.executedAt || command.updatedAt || command.createdAt || now(),
            failureReason: command.failureReason || "",
        }));
        changed = true;
    }

    data.notificationChannels = (data.notificationChannels || initialData.notificationChannels).map((channel) => {
        const type = channel.type === "dashboard" ? "in_app" : channel.type;
        const isActive = channel.isActive ?? channel.enabled ?? true;

        if (type !== channel.type || isActive !== channel.isActive) {
            changed = true;
        }

        return {
            ...channel,
            type,
            isActive,
            enabled: isActive,
        };
    });

    if (!data.notificationChannels.some((channel) => channel.type === "in_app")) {
        data.notificationChannels = [initialData.notificationChannels[0], ...data.notificationChannels];
        changed = true;
    }

    data.alertDeliveries = (data.alertDeliveries || []).map((delivery) => {
        const normalizedDelivery = {
            ...delivery,
            channelType: delivery.channelType || "in_app",
            recipientUserId: delivery.recipientUserId || "USR-001",
            recipientEmail: delivery.recipientEmail || "demo@lowcortisol.com",
            recipientDisplayName: delivery.recipientDisplayName || "LowCortisol Operations",
            messageTitle: delivery.messageTitle || "",
            messageDescription: delivery.messageDescription || "",
            attemptedAt: delivery.attemptedAt || delivery.createdAt || now(),
            failureReason: delivery.failureReason || "",
        };

        if (JSON.stringify(normalizedDelivery) !== JSON.stringify(delivery)) {
            changed = true;
        }

        return normalizedDelivery;
    });

    const defaultDevicePlacement = {
        "DEV-HUB-001": { roomId: "ROOM-001", deviceGroupId: "GROUP-001" },
        "DEV-HUB-002": { roomId: "ROOM-003", deviceGroupId: "GROUP-003" },
        "DEV-HUB-003": { roomId: "ROOM-004", deviceGroupId: "GROUP-004" },
    };

    data.devices = (data.devices || []).map((device) => {
        const placement = defaultDevicePlacement[device.id] || {};
        const roomId = device.roomId || placement.roomId || "";
        const deviceGroupId = device.deviceGroupId || placement.deviceGroupId || "";

        if (roomId !== device.roomId || deviceGroupId !== device.deviceGroupId) {
            changed = true;
        }

        return {
            ...device,
            roomId,
            deviceGroupId,
        };
    });

    const incidentPlacement = {
        "INC-001": {
            roomId: "ROOM-001",
            deviceGroupId: "GROUP-001",
            deviceId: "DEV-HUB-001",
            sensorId: "SEN-GAS-001",
        },
        "INC-002": {
            roomId: "ROOM-004",
            deviceGroupId: "GROUP-004",
            deviceId: "DEV-HUB-003",
            sensorId: "SEN-WATER-IND-001",
        },
    };

    data.incidents = (data.incidents || []).map((incident) => {
        const placement = incidentPlacement[incident.id] || {};
        const normalizedIncident = {
            ...incident,
            roomId: incident.roomId || placement.roomId || "",
            deviceGroupId: incident.deviceGroupId || placement.deviceGroupId || "",
            deviceId: incident.deviceId || placement.deviceId || "",
            sensorId: incident.sensorId || placement.sensorId || "",
        };

        if (JSON.stringify(normalizedIncident) !== JSON.stringify(incident)) {
            changed = true;
        }

        return normalizedIncident;
    });

    if (purgeDeletedSiteArtifacts(data)) {
        changed = true;
    }

    return { data, changed };
}

export class LocalPlatformDataService {
    static getData() {
        const storedData = LocalStorageService.get(STORAGE_KEY);

        if (storedData) {
            const shapedData = ensureDataShape(storedData);

            if (shapedData.changed) {
                LocalStorageService.set(STORAGE_KEY, shapedData.data);
            }

            return shapedData.data;
        }

        const initialData = buildInitialData();
        LocalStorageService.set(STORAGE_KEY, initialData);

        return initialData;
    }

    static saveData(data) {
        LocalStorageService.set(STORAGE_KEY, data);
    }

    static list(collectionName, filters = {}) {
        const data = LocalPlatformDataService.getData();
        const collection = data[collectionName] || [];

        return clone(collection.filter((item) => matchesFilters(item, filters)));
    }

    static getById(collectionName, id) {
        const data = LocalPlatformDataService.getData();
        const collection = data[collectionName] || [];
        const item = collection.find((entry) => entry.id === id) || null;

        return clone(item);
    }

    static create(collectionName, attributes = {}) {
        const data = LocalPlatformDataService.getData();
        const collection = data[collectionName] || [];
        const timestamp = now();
        const item = {
            id: attributes.id || createId(collectionName),
            ...attributes,
            createdAt: attributes.createdAt || timestamp,
            updatedAt: attributes.updatedAt || timestamp,
        };

        data[collectionName] = [...collection, item];
        LocalPlatformDataService.saveData(data);

        return clone(item);
    }

    static update(collectionName, id, attributes = {}) {
        const data = LocalPlatformDataService.getData();
        const collection = data[collectionName] || [];
        const itemIndex = collection.findIndex((entry) => entry.id === id);

        if (itemIndex < 0) {
            throw new Error("No se encontro el registro solicitado.");
        }

        const updatedItem = {
            ...collection[itemIndex],
            ...attributes,
            updatedAt: now(),
        };

        data[collectionName] = collection.map((item, index) =>
            index === itemIndex ? updatedItem : item
        );
        LocalPlatformDataService.saveData(data);

        return clone(updatedItem);
    }

    static remove(collectionName, id) {
        const data = LocalPlatformDataService.getData();
        const collection = data[collectionName] || [];

        data[collectionName] = collection.filter((entry) => entry.id !== id);
        LocalPlatformDataService.saveData(data);
    }
}
