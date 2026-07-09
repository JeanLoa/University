import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Workplace } from "../../domain/model/workplace.entity";
import { WorkplaceResource } from "../resource/workplace.resource";
import { SiteAssembler } from "./site.assembler";
import { SiteMemberAssembler } from "./site-member.assembler";
import { SiteDeviceAssignmentAssembler } from "./site-device-assignment.assembler";

export class WorkplaceAssembler extends BaseAssembler {
    constructor() {
        super();

        this.siteAssembler = new SiteAssembler();
        this.siteMemberAssembler = new SiteMemberAssembler();
        this.siteDeviceAssignmentAssembler = new SiteDeviceAssignmentAssembler();
    }

    toEntity(resource) {
        return new Workplace({
            id: resource.id,
            name: resource.name,
            ownerId: resource.ownerId,
            planId: resource.planId,
            sites: this.siteAssembler.toEntities(resource.sites ?? []),
            members: this.siteMemberAssembler.toEntities(resource.members ?? []),
            deviceAssignments: this.siteDeviceAssignmentAssembler.toEntities(resource.deviceAssignments ?? []),
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new WorkplaceResource({
            id: entity.id,
            name: entity.name,
            ownerId: entity.ownerId,
            planId: entity.planId,
            sites: this.siteAssembler.toResource(entity.sites ?? []),
            members: this.siteMemberAssembler.toResource(entity.members ?? []),
            deviceAssignments: this.siteDeviceAssignmentAssembler.toResource(entity.deviceAssignments ?? []),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}