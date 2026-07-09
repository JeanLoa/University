package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.Room;
import com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources.RoomResource;

public class RoomResourceFromEntityAssembler {
    private RoomResourceFromEntityAssembler() {
    }

    public static RoomResource toResourceFromEntity(Room entity) {
        return RoomResource.from(entity);
    }
}