export class SubscriptionPolicyService {
    static canChangePlan(subscription) {
        return subscription?.status === "active";
    }

    static canCancel(subscription) {
        return subscription?.status === "active" || subscription?.status === "suspended";
    }

    static requiresPayment(plan) {
        return Number(plan?.price || 0) > 0;
    }
}