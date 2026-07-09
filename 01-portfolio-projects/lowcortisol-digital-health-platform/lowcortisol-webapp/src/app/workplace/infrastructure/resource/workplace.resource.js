import { BaseResource } from "../../../shared/infrastructure/resource/base.resource";

export class WorkplaceResource extends BaseResource {
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
}