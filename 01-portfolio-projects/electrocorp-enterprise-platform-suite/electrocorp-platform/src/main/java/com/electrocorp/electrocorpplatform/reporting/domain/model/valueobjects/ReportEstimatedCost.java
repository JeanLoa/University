package com.electrocorp.electrocorpplatform.reporting.domain.model.valueobjects;

import com.electrocorp.electrocorpplatform.shared.domain.valueobjects.Money;

public record ReportEstimatedCost(Money value) {
    public ReportEstimatedCost {
        if (value == null) {
            throw new IllegalArgumentException("Report estimated cost is required.");
        }
    }
}