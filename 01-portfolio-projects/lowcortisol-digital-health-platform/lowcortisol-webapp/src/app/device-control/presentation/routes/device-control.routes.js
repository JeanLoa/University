import DevicePage from "../pages/device/conduit-page.component.vue";
import ValvePage from "../pages/valve/valve-page.component.vue";

export const deviceControlRoutes = [
    {
        path: "/devices",
        name: "devices",
        component: DevicePage,
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
        },
    },
    {
        path: "/valves",
        name: "valves",
        component: ValvePage,
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
        },
    },
];
