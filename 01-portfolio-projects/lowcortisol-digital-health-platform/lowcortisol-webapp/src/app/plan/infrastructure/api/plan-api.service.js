import { AuthSessionService } from "../../../shared/application/services/auth-session.service";
import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";

function getCurrentUserId() {
    const user = AuthSessionService.getCurrentUser();

    if (!user) {
        throw new Error("No hay sesion activa.");
    }

    return user.id;
}

function getPlan(planId) {
    const plan = LocalPlatformDataService.getById("plans", planId);

    if (!plan) {
        throw new Error("No se encontro el plan solicitado.");
    }

    return plan;
}

function getOperationalUsage() {
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

    return {
        sites: sites.length,
        devices: devices.length + sensors.length + valves.length,
    };
}

function assertPlanCoversUsage(plan) {
    const usage = getOperationalUsage();

    if (Number(plan.maxSites || 0) > 0 && usage.sites > Number(plan.maxSites || 0)) {
        throw new Error(
            `No puedes usar ${plan.name}: tienes ${usage.sites} sede(s) y el plan permite ${plan.maxSites}.`
        );
    }

    if (Number(plan.maxDevices || 0) > 0 && usage.devices > Number(plan.maxDevices || 0)) {
        throw new Error(
            `No puedes usar ${plan.name}: tienes ${usage.devices} dispositivo(s) y el plan permite ${plan.maxDevices}.`
        );
    }
}

export class PlanApiService {
    async getPlans() {
        return LocalPlatformDataService.list("plans");
    }

    async getPlanById(planId) {
        return getPlan(planId);
    }

    async getActiveSubscription() {
        const userId = getCurrentUserId();
        const subscriptions = LocalPlatformDataService.list("subscriptions", {
            userId,
            status: "active",
        });

        return subscriptions[0] || null;
    }

    async subscribe(subscriptionRequest) {
        const userId = getCurrentUserId();
        const plan = getPlan(subscriptionRequest.planId);

        assertPlanCoversUsage(plan);

        const subscription = LocalPlatformDataService.create("subscriptions", {
            userId,
            workplaceId: subscriptionRequest.workplaceId || "WORKPLACE-001",
            planId: subscriptionRequest.planId,
            status: "active",
            startedAt: new Date().toISOString(),
            expiresAt: null,
            autoRenew: true,
        });

        LocalPlatformDataService.create("payments", {
            subscriptionId: subscription.id,
            amount: plan.price,
            currency: plan.currency || "PEN",
            method: subscriptionRequest.paymentMethod || "card",
            status: "paid",
            paidAt: new Date().toISOString(),
        });

        return subscription;
    }

    async changePlan(planChange) {
        const activeSubscription = await this.getActiveSubscription();

        if (!activeSubscription) {
            throw new Error("No tienes una suscripcion activa.");
        }

        const plan = getPlan(planChange.newPlanId);

        assertPlanCoversUsage(plan);

        const updatedSubscription = LocalPlatformDataService.update(
            "subscriptions",
            activeSubscription.id,
            {
                planId: planChange.newPlanId,
            }
        );

        LocalPlatformDataService.create("payments", {
            subscriptionId: activeSubscription.id,
            amount: plan.price,
            currency: plan.currency || "PEN",
            method: "card",
            status: "paid",
            paidAt: new Date().toISOString(),
        });

        LocalPlatformDataService.create("serviceRequests", {
            subscriptionId: activeSubscription.id,
            type: "change-plan",
            description: `Cambio solicitado al plan ${plan.name}.`,
            status: "resolved",
        });

        return updatedSubscription;
    }

    async cancelSubscription(cancellation = {}) {
        const activeSubscription = await this.getActiveSubscription();

        if (!activeSubscription) {
            throw new Error("No tienes una suscripcion activa.");
        }

        const cancelledSubscription = LocalPlatformDataService.update(
            "subscriptions",
            activeSubscription.id,
            {
                status: "cancelled",
                autoRenew: false,
            }
        );

        LocalPlatformDataService.create("serviceRequests", {
            subscriptionId: activeSubscription.id,
            type: "cancellation",
            description: cancellation.reason || "Cancelacion solicitada por el usuario.",
            status: "open",
        });

        return cancelledSubscription;
    }

    async getPayments() {
        const userId = getCurrentUserId();
        const subscriptions = LocalPlatformDataService.list("subscriptions", {
            userId,
        });
        const subscriptionIds = subscriptions.map((subscription) => subscription.id);

        return LocalPlatformDataService.list("payments").filter((payment) =>
            subscriptionIds.includes(payment.subscriptionId)
        );
    }

    async getServiceRequest() {
        const userId = getCurrentUserId();
        const subscriptions = LocalPlatformDataService.list("subscriptions", {
            userId,
        });
        const subscriptionIds = subscriptions.map((subscription) => subscription.id);

        return LocalPlatformDataService.list("serviceRequests").filter((request) =>
            subscriptionIds.includes(request.subscriptionId)
        );
    }

    async getSummary() {
        const plans = await this.getPlans();
        const subscription = await this.getActiveSubscription();
        const payments = await this.getPayments();
        const serviceRequests = await this.getServiceRequest();
        const activePlan = subscription
            ? plans.find((plan) => plan.id === subscription.planId)
            : null;
        const usage = getOperationalUsage();

        return {
            totalPlans: plans.length,
            activePlanName: activePlan?.name || "Sin plan",
            subscriptionStatus: subscription?.status || "inactive",
            totalPayments: payments.length,
            totalPaid: payments.reduce((total, payment) => total + Number(payment.amount || 0), 0),
            serviceRequest: serviceRequests.length,
            maxSites: activePlan?.maxSites || 0,
            maxDevices: activePlan?.maxDevices || 0,
            usedSites: usage.sites,
            usedDevices: usage.devices,
            remainingSites: Math.max(0, Number(activePlan?.maxSites || 0) - usage.sites),
            remainingDevices: Math.max(0, Number(activePlan?.maxDevices || 0) - usage.devices),
        };
    }
}
