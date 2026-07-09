import { reactive, readonly } from "vue";
import { PlanFacade } from "../services/plan.facade";

const planFacade = new PlanFacade();

const state = reactive({
    plans: [],
    subscription: null,
    payments: [],
    serviceRequest: [],
    summary: {
        totalPlans: 0,
        activePlanName: "",
        subscriptionStatus: "",
        totalPayments: 0,
        totalPaid: 0,
        serviceRequest: 0,
        maxSites: 0,
        maxDevices: 0,
        usedSites: 0,
        usedDevices: 0,
        remainingSites: 0,
        remainingDevices: 0,
    },
    loading: false,
    error: null,
    message: "",
});

async function loadPlanPage() {
    state.loading = true;
    state.error = null;

    try {
        state.plans = await planFacade.getPlans();
        state.subscription = await planFacade.getActiveSubscription();
        state.payments = await planFacade.getPayments();
        state.serviceRequest = await planFacade.getServiceRequest();
        state.summary = await planFacade.getSummary();
    } catch (error) {
        state.error = error.message || "No se pudieron cargar los planes.";
    } finally {
        state.loading = false;
    }
}

async function subscribeToPlan(planId) {
    state.error = null;
    state.message = "";

    try {
        const subscription = await planFacade.subscribe({
            userId: "USR-001",
            workplaceId: "WORKPLACE-001",
            planId,
            paymentMethod: "card",
        });

        await loadPlanPage();

        state.message = "Suscripcion creada correctamente.";

        return subscription;
    } catch (error) {
        state.error = error.message || "No se pudo crear la suscripcion.";
        throw error;
    }
}

async function changePlan(planId) {
    state.error = null;
    state.message = "";

    try {
        const subscription = await planFacade.changePlan({
            subscriptionId: state.subscription?.id,
            newPlanId: planId,
        });

        await loadPlanPage();

        state.message = "Plan actualizado correctamente.";

        return subscription;
    } catch (error) {
        state.error = error.message || "No se pudo cambiar el plan.";
        throw error;
    }
}

async function cancelSubscription() {
    state.error = null;
    state.message = "";

    try {
        const subscription = await planFacade.cancelSubscription({
            subscriptionId: state.subscription?.id,
            reason: "Cancelacion solicitada desde la vista de planes.",
        });

        await loadPlanPage();

        state.message = "Suscripcion cancelada correctamente.";

        return subscription;
    } catch (error) {
        state.error = error.message || "No se pudo cancelar la suscripcion.";
        throw error;
    }
}

function getActivePlan() {
    return state.plans.find((plan) => plan.id === state.subscription?.planId) ?? null;
}

export function usePlanStore() {
    return {
        state: readonly(state),
        loadPlanPage,
        subscribeToPlan,
        changePlan,
        cancelSubscription,
        getActivePlan,
    };
}
