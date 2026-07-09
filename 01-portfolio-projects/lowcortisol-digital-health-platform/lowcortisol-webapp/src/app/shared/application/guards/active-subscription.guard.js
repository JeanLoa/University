import { STORAGE_KEYS } from "../../infrastructure/constants/storage.keys";
import { LocalStorageService } from "../../infrastructure/storage/local-storage.service";

export function activeSubscriptionGuard(to, from, next) {
    const activePlan = LocalStorageService.get(STORAGE_KEYS.ACTIVE_PLAN, {
        id: "PLAN-BASIC",
        status: "active",
    });

    if (activePlan?.status === "active") {
        next();
        return;
    }

    next({
        name: "plans",
        query: {
            redirect: to.fullPath,
        },
    });
}