package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.NonBlankText;

public record TicketTitle(String value) {
    public TicketTitle {
        value = NonBlankText.of(value).value();
        if (value.length() > 160) {
            throw new IllegalArgumentException("Ticket title cannot exceed 160 characters.");
        }
    }
}