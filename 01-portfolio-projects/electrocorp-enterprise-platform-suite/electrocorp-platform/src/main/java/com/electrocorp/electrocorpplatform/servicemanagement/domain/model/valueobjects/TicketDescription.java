package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.NonBlankText;

public record TicketDescription(String value) {
    public TicketDescription {
        value = NonBlankText.of(value).value();
        if (value.length() > 2000) {
            throw new IllegalArgumentException("Ticket description cannot exceed 2000 characters.");
        }
    }
}