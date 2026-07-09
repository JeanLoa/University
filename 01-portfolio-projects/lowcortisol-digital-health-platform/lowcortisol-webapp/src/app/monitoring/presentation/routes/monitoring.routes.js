import DashboardPage from "../pages/dashboard/dashboard-page.component.vue";
import ReportPage from "../pages/report/report-page.component.vue";

export const monitoringRoutes = [
    {
        path: "/dashboard",
        name: "dashboard",
        component: DashboardPage,
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
        },
    },
    {
        path: "/reports",
        name: "reports",
        component: ReportPage,
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
        },
    },
];