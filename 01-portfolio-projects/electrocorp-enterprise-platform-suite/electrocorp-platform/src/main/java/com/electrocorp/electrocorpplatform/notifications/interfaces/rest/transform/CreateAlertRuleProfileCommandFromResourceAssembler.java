package com.electrocorp.electrocorpplatform.notifications.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.notifications.domain.model.commands.CreateAlertRuleProfileCommand;
import com.electrocorp.electrocorpplatform.notifications.interfaces.rest.resources.CreateAlertRuleProfileResource;

public class CreateAlertRuleProfileCommandFromResourceAssembler {
    public static CreateAlertRuleProfileCommand toCommandFromResource(CreateAlertRuleProfileResource resource, Long userId) {
        return new CreateAlertRuleProfileCommand(
                userId,
                resource.name(),
                resource.description(),
                resource.scopeType(),
                resource.scopeId(),
                resource.mode(),
                resource.sensitivity()
        );
    }
}
