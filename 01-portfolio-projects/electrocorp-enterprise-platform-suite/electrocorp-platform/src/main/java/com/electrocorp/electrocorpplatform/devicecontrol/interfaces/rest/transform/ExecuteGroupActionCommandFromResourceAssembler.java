package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands.ExecuteGroupActionCommand;
import com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources.ExecuteGroupActionResource;

public class ExecuteGroupActionCommandFromResourceAssembler {
    public static ExecuteGroupActionCommand toCommandFromResource(ExecuteGroupActionResource resource) {
        return new ExecuteGroupActionCommand(resource.status());
    }
}