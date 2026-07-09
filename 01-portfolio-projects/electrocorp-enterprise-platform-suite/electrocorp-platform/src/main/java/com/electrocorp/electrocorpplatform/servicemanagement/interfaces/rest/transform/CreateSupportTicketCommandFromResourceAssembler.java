package com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.servicemanagement.domain.model.commands.CreateSupportTicketCommand;
import com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.resources.CreateSupportTicketResource;

public class CreateSupportTicketCommandFromResourceAssembler {
    public static CreateSupportTicketCommand toCommandFromResource(CreateSupportTicketResource resource, Long userId) {
        return new CreateSupportTicketCommand(
                userId,
                resource.subject(),
                resource.description(),
                resource.priority()
        );
    }
}
