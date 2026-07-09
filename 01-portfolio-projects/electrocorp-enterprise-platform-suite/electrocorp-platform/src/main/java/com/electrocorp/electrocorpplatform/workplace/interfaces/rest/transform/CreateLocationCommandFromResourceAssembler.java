package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.workplace.domain.model.commands.CreateLocationCommand;
import com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources.CreateLocationResource;

public class CreateLocationCommandFromResourceAssembler {
    private CreateLocationCommandFromResourceAssembler() {
    }

    public static CreateLocationCommand toCommandFromResource(CreateLocationResource resource, Long userId) {
        return new CreateLocationCommand(userId, resource.name(), resource.address(), resource.type());
    }
}
