package com.electrocorp.electrocorpplatform.notifications.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.NonBlankText;

public record AlertMessage(String value) {
    public AlertMessage {
        value = NonBlankText.of(value).value();
        if (value.length() > 1000) {
            throw new IllegalArgumentException("Alert message cannot exceed 1000 characters.");
        }
    }
}