package com.electrocorp.electrocorpplatform.reporting.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.NonBlankText;

public record EnergyGoalTitle(String value) {
    public EnergyGoalTitle {
        value = NonBlankText.of(value).value();
        if (value.length() > 120) {
            throw new IllegalArgumentException("Energy goal title cannot exceed 120 characters.");
        }
    }
}