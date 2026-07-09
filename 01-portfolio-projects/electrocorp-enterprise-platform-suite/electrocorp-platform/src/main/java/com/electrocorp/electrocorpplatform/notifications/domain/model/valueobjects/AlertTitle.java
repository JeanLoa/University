package com.electrocorp.electrocorpplatform.notifications.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.NonBlankText;

public record AlertTitle(String value) {
    public AlertTitle {
        value = NonBlankText.of(value).value();
        if (value.length() > 120) {
            throw new IllegalArgumentException("Alert title cannot exceed 120 characters.");
        }
    }
}