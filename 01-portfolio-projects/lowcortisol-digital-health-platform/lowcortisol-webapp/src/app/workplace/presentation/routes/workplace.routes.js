import SitePage from "../pages/site/site-page.component.vue";

export const workplaceRoutes = [
    {
        path: "/sites",
        name: "sites",
        component: SitePage,
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
        },
    },
];