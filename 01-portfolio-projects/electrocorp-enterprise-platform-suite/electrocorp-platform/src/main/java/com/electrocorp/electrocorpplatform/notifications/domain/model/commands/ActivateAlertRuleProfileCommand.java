package com.electrocorp.electrocorpplatform.notifications.domain.model.commands;

public record ActivateAlertRuleProfileCommand(
        Long userId,
        Long profileId
) {
}
