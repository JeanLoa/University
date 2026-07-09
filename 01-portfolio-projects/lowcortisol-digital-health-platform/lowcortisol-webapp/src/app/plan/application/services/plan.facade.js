import { PlanApiService } from "../../infrastructure/api/plan-api.service";

export class PlanFacade {
    constructor() {
        this.planApiService = new PlanApiService();
    }

    async getPlans() {
        return this.planApiService.getPlans();
    }

    async getPlanById(planId) {
        return this.planApiService.getPlanById(planId);
    }

    async getActiveSubscription() {
        return this.planApiService.getActiveSubscription();
    }

    async subscribe(payload) {
        return this.planApiService.subscribe(payload);
    }

    async changePlan(payload) {
        return this.planApiService.changePlan(payload);
    }

    async cancelSubscription(payload) {
        return this.planApiService.cancelSubscription(payload);
    }

    async getPayments() {
        return this.planApiService.getPayments();
    }

    async getServiceRequest() {
        return this.planApiService.getServiceRequest();
    }

    async getSummary() {
        return this.planApiService.getSummary();
    }
}