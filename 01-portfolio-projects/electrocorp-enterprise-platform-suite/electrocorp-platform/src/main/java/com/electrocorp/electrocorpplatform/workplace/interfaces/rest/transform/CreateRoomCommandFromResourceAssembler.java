package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.workplace.domain.model.commands.CreateRoomCommand;
import com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources.CreateRoomResource;

public class CreateRoomCommandFromResourceAssembler {
    private CreateRoomCommandFromResourceAssembler() {
    }

    public static CreateRoomCommand toCommandFromResource(CreateRoomResource resource) {
        return new CreateRoomCommand(resource.locationId(), resource.name(), resource.floor());
    }
}