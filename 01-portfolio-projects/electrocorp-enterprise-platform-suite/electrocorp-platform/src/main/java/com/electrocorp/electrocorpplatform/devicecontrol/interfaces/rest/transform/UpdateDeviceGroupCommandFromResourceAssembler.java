package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands.UpdateDeviceGroupCommand;
import com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources.UpdateDeviceGroupResource;

public class UpdateDeviceGroupCommandFromResourceAssembler {
    public static UpdateDeviceGroupCommand toCommandFromResource(UpdateDeviceGroupResource resource) {
        return new UpdateDeviceGroupCommand(
                resource.name(),
                resource.description(),
                resource.deviceIds()
        );
    }
}
