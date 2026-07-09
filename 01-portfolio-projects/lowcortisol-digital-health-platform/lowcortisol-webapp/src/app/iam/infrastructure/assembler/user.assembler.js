import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { User } from "../../domain/model/user.entity";
import { UserResource } from "../resource/user.resource";

export class UserAssembler extends BaseAssembler {
    toEntity(resource) {
        return new User({
            id: resource.id,
            fullName: resource.fullName,
            email: resource.email,
            phone: resource.phone,
            status: resource.status,
            accessProfileId: resource.accessProfileId,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new UserResource({
            id: entity.id,
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            status: entity.status,
            accessProfileId: entity.accessProfileId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}