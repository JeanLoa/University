package com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProcessPaymentResource(
        @NotNull Long subscriptionId,
        @NotBlank String holderName,
        @NotBlank String cardNumber,
        @NotBlank String expirationDate,
        @NotBlank String cvv
) {
}
