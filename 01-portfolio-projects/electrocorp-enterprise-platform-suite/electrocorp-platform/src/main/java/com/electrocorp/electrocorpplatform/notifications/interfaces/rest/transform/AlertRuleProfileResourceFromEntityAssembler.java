package com.electrocorp.electrocorpplatform.notifications.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRuleProfile;
import com.electrocorp.electrocorpplatform.notifications.interfaces.rest.resources.AlertRuleProfileResource;

public class AlertRuleProfileResourceFromEntityAssembler {
    public static AlertRuleProfileResource toResourceFromEntity(AlertRuleProfile profile) {
        return AlertRuleProfileResource.from(profile);
    }
}
