import { WorkplaceApiService } from "./workplace-api.service";
import { LocalPlatformDataService } from "../../../shared/infrastructure/data/local-platform-data.service";

export class SiteApiService extends WorkplaceApiService {
    async updateSite(siteId, site) {
        return LocalPlatformDataService.update("sites", siteId, site);
    }

    async updateSiteStatus(siteId, status, snapshot = null) {
        return super.updateSiteStatus(siteId, status, snapshot);
    }

    async deleteSite(siteId, snapshot = null) {
        return super.deleteSite(siteId, snapshot);
    }

    async getSiteMembers(siteId = "") {
        return this.getMembersBySite(siteId);
    }

    async getSiteDeviceAssignments(siteId = "") {
        return this.getAssignmentsBySite(siteId);
    }
}
