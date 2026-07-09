package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.workplace.domain.model.commands.AssignDeviceCommand;
import com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources.AssignDeviceResource;

public class AssignDeviceCommandFromResourceAssembler {
    private AssignDeviceCommandFromResourceAssembler() {
    }

    public static AssignDeviceCommand toCommandFromResource(AssignDeviceResource resource) {
        return new AssignDeviceCommand(resource.deviceId(), resource.roomId(), resource.locationId());
    }
}