package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands.UpdateRoutineStatusCommand;
import com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources.UpdateRoutineStatusResource;

public class UpdateRoutineStatusCommandFromResourceAssembler {
    public static UpdateRoutineStatusCommand toCommandFromResource(UpdateRoutineStatusResource resource) {
        return new UpdateRoutineStatusCommand(resource.enabled());
    }
}