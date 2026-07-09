import { BaseAssembler } from "../../../shared/infrastructure/assembler/base.assembler";
import { Valve } from "../../domain/model/valve.entity";
import { ValveResource } from "../resource/valve.resource";

export class ValveAssembler extends BaseAssembler {
    toEntity(resource) {
        return new Valve({
            id: resource.id,
            deviceId: resource.deviceId,
            siteId: resource.siteId,
            name: resource.name,
            resourceType: resource.resourceType,
            status: resource.status,
            openingPercentage: resource.openingPercentage,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
        });
    }

    toResource(entity) {
        return new ValveResource({
            id: entity.id,
            deviceId: entity.deviceId,
            siteId: entity.siteId,
            name: entity.name,
            resourceType: entity.resourceType,
            status: entity.status,
            openingPercentage: entity.openingPercentage,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
}