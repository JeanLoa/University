import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { ServiceRequest } from "../../domain/model/service-request.entity";
import { ServiceRequestResource } from "../resource/service-request.resource";

export class ServiceRequestAssembler extends BaseAssembler {
    toEntity(resource) {
        return new ServiceRequest({
            id: resource.id,
            subscriptionId: resource.subscriptionId,
            type: resource.type,
            description: resource.description,
            status: resource.status,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new ServiceRequestResource({
            id: entity.id,
            subscriptionId: entity.subscriptionId,
            type: entity.type,
            description: entity.description,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}