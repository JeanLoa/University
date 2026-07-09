import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { SiteMember } from "../../domain/model/site-member.entity";
import { SiteMemberResource } from "../resource/site-member.resource";

export class SiteMemberAssembler extends BaseAssembler {
    toEntity(resource) {
        return new SiteMember({
            id: resource.id,
            siteId: resource.siteId,
            userId: resource.userId,
            fullName: resource.fullName,
            email: resource.email,
            role: resource.role,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SiteMemberResource({
            id: entity.id,
            siteId: entity.siteId,
            userId: entity.userId,
            fullName: entity.fullName,
            email: entity.email,
            role: entity.role,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}