import { BaseEntity } from "../../../shared/domain/model/base.entity";

export class Workplace extends BaseEntity {
    constructor({
                    id = null,
                    name = "",
                    ownerId = "",
                    planId = "PLAN-BASIC",
                    sites = [],
                    members = [],
                    deviceAssignments = [],
                    createdAt = null,
                    updatedAt = null,
                } = {}) {
        super({ id, createdAt, updatedAt });

        this.name = name;
        this.ownerId = ownerId;
        this.planId = planId;
        this.sites = sites;
        this.members = members;
        this.deviceAssignments = deviceAssignments;
    }

    addSite(site) {
        this.sites.push(site);
        this.updateTimestamp();
    }

    addMember(member) {
        this.members.push(member);
        this.updateTimestamp();
    }

    assignDevice(assignment) {
        this.deviceAssignments.push(assignment);
        this.updateTimestamp();
    }

    get totalSites() {
        return this.sites.length;
    }

    get activeSites() {
        return this.sites.filter((site) => site.status === "active").length;
    }

    get totalMembers() {
        return this.members.length;
    }

    get totalDeviceAssignments() {
        return this.deviceAssignments.length;
    }
}