package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.Location;
import com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources.LocationResource;

public class LocationResourceFromEntityAssembler {
    private LocationResourceFromEntityAssembler() {
    }

    public static LocationResource toResourceFromEntity(Location entity) {
        return LocationResource.from(entity);
    }
}