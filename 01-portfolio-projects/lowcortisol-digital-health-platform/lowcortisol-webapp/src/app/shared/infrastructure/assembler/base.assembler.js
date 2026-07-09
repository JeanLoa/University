export class BaseAssembler {
    toEntity(resource) {
        return resource;
    }

    toResource(entity) {
        return entity;
    }

    toResponse(response) {
        return response;
    }

    toEntities(resource = []) {
        return resource.map((resource) => this.toEntity(resource));
    }

    toResource(entities = []) {
        return entities.map((entity) => this.toResource(entity));
    }
}