package com.electrocorp.electrocorpplatform.notifications.domain.model.commands;

public record ToggleAlertRuleCommand(
        Long userId,
        Long ruleId
) {
}