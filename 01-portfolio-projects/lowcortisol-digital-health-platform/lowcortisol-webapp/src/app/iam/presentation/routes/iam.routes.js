import LoginPage from "../pages/login/login-page.component.vue";
import RegisterPage from "../pages/register/register-page.component.vue";
import ProfilePage from "../pages/profile/profile-page.component.vue";
import RecoverPasswordPage from "../pages/recover-password/recover-password-page.component.vue";

export const iamRoutes = [
    {
        path: "/login",
        name: "login",
        component: () => import("../pages/login/login-page.component.vue"),
        meta: {
            public: true,
            titleKey: "pageTitle.login",
            hideNavigation: true,
        },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../pages/register/register-page.component.vue"),
        meta: {
            public: true,
            titleKey: "pageTitle.register",
            hideNavigation: true,
        },
    },
    {
        path: "/recover-password",
        name: "recover-password",
        component: () =>
            import("../pages/recover-password/recover-password-page.component.vue"),
        meta: {
            public: true,
            titleKey: "pageTitle.recoverPassword",
            hideNavigation: true,
        },
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("../pages/profile/profile-page.component.vue"),
        meta: {
            requiresAuth: true,
            titleKey: "pageTitle.profile",
        },
    },
];