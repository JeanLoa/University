package com.electrocorp.electrocorpplatform.notifications.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRule;
import com.electrocorp.electrocorpplatform.notifications.interfaces.rest.resources.AlertRuleResource;

public class AlertRuleResourceFromEntityAssembler {
    public static AlertRuleResource toResourceFromEntity(AlertRule rule) {
        return AlertRuleResource.from(rule);
    }
}
