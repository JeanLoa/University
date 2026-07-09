package com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources;

import jakarta.validation.constraints.NotBlank;

public record SubscribeResource(
        @NotBlank String planCode
) {
}
