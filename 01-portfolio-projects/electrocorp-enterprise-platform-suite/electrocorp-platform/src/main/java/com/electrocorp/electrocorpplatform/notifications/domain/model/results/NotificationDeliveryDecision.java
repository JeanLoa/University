package com.electrocorp.electrocorpplatform.notifications.domain.model.results;

import com.electrocorp.electrocorpplatform.notifications.domain.model.valueobjects.NotificationDeliveryMode;

public record NotificationDeliveryDecision(
        boolean allowed,
        NotificationDeliveryMode deliveryMode,
        boolean soundAllowed,
        boolean toastAllowed,
        boolean inboxAllowed,
        String reason
) {
}
