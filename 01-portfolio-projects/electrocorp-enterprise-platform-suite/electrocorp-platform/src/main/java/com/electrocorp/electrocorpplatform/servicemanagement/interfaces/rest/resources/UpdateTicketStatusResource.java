package com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.resources;

import jakarta.validation.constraints.NotBlank;

public record UpdateTicketStatusResource(
        @NotBlank String status
) {
}