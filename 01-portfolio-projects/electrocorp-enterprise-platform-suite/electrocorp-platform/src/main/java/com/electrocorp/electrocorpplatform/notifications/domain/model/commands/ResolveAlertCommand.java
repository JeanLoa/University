package com.electrocorp.electrocorpplatform.notifications.domain.model.commands;

public record ResolveAlertCommand(
        Long userId,
        Long alertId
) {
}
