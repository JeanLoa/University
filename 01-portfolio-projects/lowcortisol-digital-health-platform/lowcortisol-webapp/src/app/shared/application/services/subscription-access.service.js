import { AuthSessionService } from "./auth-session.service";
import { LocalPlatformDataService } from "../../infrastructure/data/local-platform-data.service";

export class SubscriptionAccessService {
    static async hasActiveSubscription() {
        const subscription = await SubscriptionAccessService.getActiveSubscription();

        return Boolean(subscription && subscription.status === "active" && subscription.planId);
    }

    static async getActiveSubscription() {
        const user = AuthSessionService.getCurrentUser();

        if (!user) {
            return null;
        }

        const subscriptions = LocalPlatformDataService.list("subscriptions", {
            userId: user.id,
            status: "active",
        });

        return subscriptions[0] || null;
    }

    static async getActivePlan() {
        const subscription = await SubscriptionAccessService.getActiveSubscription();

        if (!subscription?.planId) {
            return null;
        }

        return LocalPlatformDataService.getById("plans", subscription.planId);
    }

    static async getUsage() {
        const [subscription, plan] = await Promise.all([
            SubscriptionAccessService.getActiveSubscription(),
            SubscriptionAccessService.getActivePlan(),
        ]);

        const sites = LocalPlatformDataService
            .list("sites")
            .filter((site) => site.status !== "deleted");

        const devices = LocalPlatformDataService
            .list("devices")
            .filter((device) => device.status !== "deleted");

        const sensors = LocalPlatformDataService
            .list("sensors")
            .filter((sensor) => sensor.status !== "deleted");

        const valves = LocalPlatformDataService
            .list("valves")
            .filter((valve) => valve.status !== "deleted");

        const usedDevices = devices.length + sensors.length + valves.length;

        return {
            hasActiveSubscription: Boolean(subscription && subscription.status === "active" && plan),
            subscription,
            plan,
            sites: {
                used: sites.length,
                limit: Number(plan?.maxSites || 0),
                remaining: Math.max(0, Number(plan?.maxSites || 0) - sites.length),
            },
            devices: {
                used: usedDevices,
                limit: Number(plan?.maxDevices || 0),
                remaining: Math.max(0, Number(plan?.maxDevices || 0) - usedDevices),
                conduits: devices.length,
                sensors: sensors.length,
                valves: valves.length,
            },
        };
    }

    static async assertCanCreateSite() {
        const usage = await SubscriptionAccessService.getUsage();

        if (!usage.hasActiveSubscription) {
            throw new Error("Necesitas un plan activo para registrar sedes.");
        }

        if (usage.sites.limit > 0 && usage.sites.used >= usage.sites.limit) {
            throw new Error(
                `Tu plan ${usage.plan.name} permite ${usage.sites.limit} sede(s). Ya usaste ${usage.sites.used}. Cambia de plan para agregar otra sede.`
            );
        }

        return usage;
    }

    static async assertCanAddDevices(quantity = 1) {
        const usage = await SubscriptionAccessService.getUsage();
        const requestedQuantity = Math.max(1, Number(quantity || 1));

        if (!usage.hasActiveSubscription) {
            throw new Error("Necesitas un plan activo para agregar dispositivos.");
        }

        if (
            usage.devices.limit > 0 &&
            usage.devices.used + requestedQuantity > usage.devices.limit
        ) {
            throw new Error(
                `Tu plan ${usage.plan.name} permite ${usage.devices.limit} dispositivo(s). Ya usaste ${usage.devices.used}. Cambia de plan para agregar mas.`
            );
        }

        return usage;
    }
}
