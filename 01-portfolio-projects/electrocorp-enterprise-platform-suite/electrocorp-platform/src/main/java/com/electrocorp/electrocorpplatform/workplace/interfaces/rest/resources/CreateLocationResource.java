package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources;

import jakarta.validation.constraints.NotBlank;

public record CreateLocationResource(
        @NotBlank String name,
        String address,
        String type
) {
}
