package com.electrocorp.electrocorpplatform.notifications.domain.model.commands;

public record MarkAlertAsReadCommand(
        Long userId,
        Long alertId
) {
}