package com.electrocorp.electrocorpplatform.energymonitoring.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.Money;

import java.math.BigDecimal;

public record EnergyCost(Money value) {
    public EnergyCost(BigDecimal amount) {
        this(Money.of(amount));
    }
}