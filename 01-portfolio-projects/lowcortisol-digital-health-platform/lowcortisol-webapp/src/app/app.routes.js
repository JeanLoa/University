import HomePage from "./shared/presentation/pages/home/home-page.component.vue";
import AboutPage from "./shared/presentation/pages/about/about-page.component.vue";
import SettingsPage from "./shared/presentation/pages/settings/settings-page.component.vue";
import NotFoundPage from "./shared/presentation/pages/not-found/not-found-page.component.vue";

import { iamRoutes } from "./iam/presentation/routes/iam.routes";
import { monitoringRoutes } from "./monitoring/presentation/routes/monitoring.routes";
import { workplaceRoutes } from "./workplace/presentation/routes/workplace.routes";
import { deviceControlRoutes } from "./device-control/presentation/routes/device-control.routes";
import { notificationRoutes } from "./notification/presentation/routes/notification.routes";
import { planRoutes } from "./plan/presentation/routes/plan.routes";
import { supportRoutes } from "./support/presentation/routes/support.routes";

export const appRoutes = [
    {
        path: "/",
        redirect: {
            name: "login",
        },
    },

    ...iamRoutes,
    ...monitoringRoutes,
    ...workplaceRoutes,
    ...deviceControlRoutes,
    ...notificationRoutes,
    ...planRoutes,
    ...supportRoutes,

    {
        path: "/home",
        name: "home",
        component: HomePage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/about",
        name: "about",
        component: AboutPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/settings",
        name: "settings",
        component: SettingsPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: NotFoundPage,
    },
];
