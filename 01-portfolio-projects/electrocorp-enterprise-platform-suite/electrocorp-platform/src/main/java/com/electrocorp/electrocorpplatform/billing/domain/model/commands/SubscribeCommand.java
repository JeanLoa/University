package com.electrocorp.electrocorpplatform.billing.domain.model.commands;

public record SubscribeCommand(
        Long userId,
        String planCode
) {
}