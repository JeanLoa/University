import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { AuthSession } from "../../domain/model/auth-session.entity";
import { AuthSessionResource } from "../resource/auth-session.resource";

export class AuthSessionAssembler extends BaseAssembler {
    toEntity(resource) {
        return new AuthSession({
            id: resource.id,
            userId: resource.userId,
            token: resource.token,
            refreshToken: resource.refreshToken,
            isActive: resource.isActive,
            startedAt: resource.startedAt,
            expiresAt: resource.expiresAt,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new AuthSessionResource({
            id: entity.id,
            userId: entity.userId,
            token: entity.token,
            refreshToken: entity.refreshToken,
            isActive: entity.isActive,
            startedAt: entity.startedAt,
            expiresAt: entity.expiresAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}