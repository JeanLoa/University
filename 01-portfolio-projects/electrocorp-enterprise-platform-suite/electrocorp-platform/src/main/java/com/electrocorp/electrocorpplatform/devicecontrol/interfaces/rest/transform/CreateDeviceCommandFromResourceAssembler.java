package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands.CreateDeviceCommand;
import com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources.CreateDeviceResource;

public class CreateDeviceCommandFromResourceAssembler {
    public static CreateDeviceCommand toCommandFromResource(CreateDeviceResource resource, Long userId) {
        return new CreateDeviceCommand(
                userId,
                resource.name(),
                resource.room(),
                resource.type(),
                resource.powerWatts()
        );
    }
}
