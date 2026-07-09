package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands.UpdateDeviceStatusCommand;
import com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources.UpdateDeviceStatusResource;

public class UpdateDeviceStatusCommandFromResourceAssembler {
    public static UpdateDeviceStatusCommand toCommandFromResource(UpdateDeviceStatusResource resource) {
        return new UpdateDeviceStatusCommand(resource.status());
    }
}