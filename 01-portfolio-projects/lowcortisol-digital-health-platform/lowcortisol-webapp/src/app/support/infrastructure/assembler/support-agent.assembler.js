import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { SupportAgent } from "../../domain/model/support-agent.entity";
import { SupportAgentResource } from "../resource/support-agent.resource";

export class SupportAgentAssembler extends BaseAssembler {
    toEntity(resource) {
        return new SupportAgent({
            id: resource.id,
            fullName: resource.fullName,
            email: resource.email,
            specialty: resource.specialty,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new SupportAgentResource({
            id: entity.id,
            fullName: entity.fullName,
            email: entity.email,
            specialty: entity.specialty,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}