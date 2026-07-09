import { AuthSessionService } from "./auth-session.service";
import { LocalPlatformDataService } from "../../infrastructure/data/local-platform-data.service";

function sum(items, field) {
    return items.reduce((total, item) => total + Number(item[field] || 0), 0);
}

export class HomeDashboardFacade {
    async getDashboard() {
        const user = AuthSessionService.getCurrentUser();
        const sites = LocalPlatformDataService.list("sites");
        const devices = LocalPlatformDataService.list("devices");
        const sensors = LocalPlatformDataService.list("sensors");
        const alerts = LocalPlatformDataService.list("alerts");
        const readings = LocalPlatformDataService.list("readings");
        const anomalies = LocalPlatformDataService.list("anomalies");
        const tickets = LocalPlatformDataService.list("supportTickets");
        const reports = LocalPlatformDataService.list("reports");
        const subscriptions = user
            ? LocalPlatformDataService.list("subscriptions", {
                userId: user.id,
                status: "active",
            })
            : [];
        const plans = LocalPlatformDataService.list("plans");
        const activeSubscription = subscriptions[0] || null;
        const activePlan = activeSubscription
            ? plans.find((plan) => plan.id === activeSubscription.planId)
            : null;

        return {
            overallStatus: alerts.some((alert) => alert.severity === "critical" && alert.status !== "closed")
                ? "warning"
                : "active",
            metrics: {
                waterMonitored: sum(
                    readings.filter((reading) => reading.resourceType === "water"),
                    "value"
                ),
                gasMonitored: sum(
                    readings.filter((reading) => reading.resourceType === "gas"),
                    "value"
                ),
                activeSensors: sensors.filter((sensor) => sensor.status === "active").length,
                criticalAlerts: alerts.filter(
                    (alert) => alert.severity === "critical" && alert.status !== "closed"
                ).length,
                activeSites: sites.filter((site) => site.status === "active").length,
                activeDevices: devices.filter((device) => device.status === "online").length,
                activePlanName: activePlan?.name || "",
            },
            monitoring: {
                readings: readings.slice(-5).reverse(),
                anomalies: anomalies.slice(-4).reverse(),
                reports: reports.slice(-3).reverse(),
            },
            sites: sites.slice(0, 3),
            devices: devices
                .filter((device) => device.status !== "online")
                .concat(devices.filter((device) => device.status === "online"))
                .slice(0, 4),
            tickets: tickets.slice(-3).reverse(),
            plan: activePlan,
        };
    }
}
