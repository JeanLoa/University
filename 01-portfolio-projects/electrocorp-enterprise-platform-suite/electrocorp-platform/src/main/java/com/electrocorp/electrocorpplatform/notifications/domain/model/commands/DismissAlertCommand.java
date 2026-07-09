package com.electrocorp.electrocorpplatform.notifications.domain.model.commands;

public record DismissAlertCommand(
        Long userId,
        Long alertId,
        Integer minutes
) {
}
