import { createRouter, createWebHistory } from "vue-router";
import { appRoutes } from "../app/app.routes";
import { AuthSessionService } from "../app/shared/application/services/auth-session.service";
import { SubscriptionAccessService } from "../app/shared/application/services/subscription-access.service";

function getStoredLanguage() {
    return localStorage.getItem("lowcortisol.language") || "es";
}

function getNestedTranslation(translations, key) {
    return key
        .split(".")
        .reduce((current, part) => current?.[part], translations);
}

async function getPageTitle(titleKey) {
    const language = getStoredLanguage();

    try {
        const response = await fetch(`/assets/i18n/${language}.json`);
        const translations = await response.json();

        return getNestedTranslation(translations, titleKey) || "LowCortisol";
    } catch {
        return "LowCortisol";
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: appRoutes,
    scrollBehavior() {
        return {
            top: 0,
            behavior: "smooth",
        };
    },
});

router.beforeEach(async (to) => {
    const titleKey = to.meta?.titleKey;

    if (titleKey) {
        const pageTitle = await getPageTitle(titleKey);
        document.title = `LowCortisol | ${pageTitle}`;
    } else {
        document.title = "LowCortisol";
    }

    const requiresAuth = Boolean(to.meta?.requiresAuth);
    const requiresSubscription = Boolean(to.meta?.requiresSubscription);
    const isAuthenticated = AuthSessionService.isAuthenticated();

    if (requiresAuth && !isAuthenticated) {
        return {
            name: "login",
        };
    }

    if (to.name === "login" && isAuthenticated) {
        const hasActiveSubscription =
            await SubscriptionAccessService.hasActiveSubscription();

        return {
            name: hasActiveSubscription ? "dashboard" : "plans",
        };
    }

    if (requiresSubscription) {
        const hasActiveSubscription =
            await SubscriptionAccessService.hasActiveSubscription();

        if (!hasActiveSubscription) {
            return {
                name: "plans",
            };
        }
    }

    return true;
});

export default router;