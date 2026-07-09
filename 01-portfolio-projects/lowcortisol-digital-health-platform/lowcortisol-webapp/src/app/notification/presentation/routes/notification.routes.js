import AlertPage from "../pages/alert/alert-page.component.vue";

export const notificationRoutes = [
    {
        path: "/alerts",
        name: "alerts",
        component: AlertPage,
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
        },
    },
];