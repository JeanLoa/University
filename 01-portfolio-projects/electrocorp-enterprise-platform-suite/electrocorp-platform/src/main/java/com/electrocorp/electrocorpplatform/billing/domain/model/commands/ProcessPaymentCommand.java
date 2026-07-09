package com.electrocorp.electrocorpplatform.billing.domain.model.commands;

public record ProcessPaymentCommand(
        Long userId,
        Long subscriptionId
) {
}