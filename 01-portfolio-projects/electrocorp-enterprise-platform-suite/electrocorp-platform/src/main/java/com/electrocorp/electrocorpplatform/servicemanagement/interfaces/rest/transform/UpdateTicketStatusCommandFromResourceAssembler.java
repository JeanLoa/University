package com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.servicemanagement.domain.model.commands.UpdateTicketStatusCommand;
import com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.resources.UpdateTicketStatusResource;

public class UpdateTicketStatusCommandFromResourceAssembler {
    public static UpdateTicketStatusCommand toCommandFromResource(UpdateTicketStatusResource resource) {
        return new UpdateTicketStatusCommand(resource.status());
    }
}