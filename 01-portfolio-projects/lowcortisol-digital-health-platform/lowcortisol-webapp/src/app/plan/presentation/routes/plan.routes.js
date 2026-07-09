import PlanPage from "../pages/plan/plan-page.component.vue";

export const planRoutes = [
    {
        path: "/plans",
        name: "plans",
        component: PlanPage,
        meta: {
            requiresAuth: true,
        },
    },
];