export class PlanPermissionService {
    static canAddSite(plan, currentSitesCount) {
        return currentSitesCount < plan.maxSites;
    }

    static canAddDevice(plan, currentDevicesCount) {
        return currentDevicesCount < plan.maxDevices;
    }

    static hasFeature(plan, featureName) {
        return plan.features.some(
            (feature) => feature.name === featureName && feature.included
        );
    }
}