import SupportPage from "../pages/support/support-page.component.vue";

export const supportRoutes = [
    {
        path: "/support",
        name: "support",
        component: SupportPage,
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
        },
    },
];