package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands.CreateDeviceGroupCommand;
import com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources.CreateDeviceGroupResource;

public class CreateDeviceGroupCommandFromResourceAssembler {
    public static CreateDeviceGroupCommand toCommandFromResource(CreateDeviceGroupResource resource, Long userId) {
        return new CreateDeviceGroupCommand(
                userId,
                resource.name(),
                resource.description(),
                resource.deviceIds()
        );
    }
}
