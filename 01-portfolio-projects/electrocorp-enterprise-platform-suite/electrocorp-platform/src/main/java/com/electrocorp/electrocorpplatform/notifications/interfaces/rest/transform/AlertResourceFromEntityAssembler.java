package com.electrocorp.electrocorpplatform.notifications.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.Alert;
import com.electrocorp.electrocorpplatform.notifications.interfaces.rest.resources.AlertResource;

public class AlertResourceFromEntityAssembler {
    public static AlertResource toResourceFromEntity(Alert alert) {
        return AlertResource.from(alert);
    }
}
