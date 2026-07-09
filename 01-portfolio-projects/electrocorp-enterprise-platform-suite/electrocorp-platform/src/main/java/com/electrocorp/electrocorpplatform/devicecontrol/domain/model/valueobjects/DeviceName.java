package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.NonBlankText;

public record DeviceName(String value) {
    public DeviceName {
        value = NonBlankText.of(value).value();
        if (value.length() > 120) {
            throw new IllegalArgumentException("Device name cannot exceed 120 characters.");
        }
    }
}