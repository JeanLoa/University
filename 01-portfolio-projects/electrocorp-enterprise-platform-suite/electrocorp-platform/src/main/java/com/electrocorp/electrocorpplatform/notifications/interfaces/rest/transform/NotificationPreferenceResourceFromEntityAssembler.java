package com.electrocorp.electrocorpplatform.notifications.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.NotificationPreference;
import com.electrocorp.electrocorpplatform.notifications.interfaces.rest.resources.NotificationPreferenceResource;

public class NotificationPreferenceResourceFromEntityAssembler {
    public static NotificationPreferenceResource toResourceFromEntity(NotificationPreference preference) {
        return NotificationPreferenceResource.from(preference);
    }
}
