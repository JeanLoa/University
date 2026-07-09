package com.electrocorp.electrocorpplatform.billing.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.DateRange;

import java.time.LocalDate;

public record BillingPeriod(DateRange range) {
    public BillingPeriod(LocalDate startDate, LocalDate endDate) {
        this(new DateRange(startDate, endDate));
    }
}