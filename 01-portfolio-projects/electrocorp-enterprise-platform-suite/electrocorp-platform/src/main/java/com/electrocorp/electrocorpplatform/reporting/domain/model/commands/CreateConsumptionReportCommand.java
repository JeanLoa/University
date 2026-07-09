package com.electrocorp.electrocorpplatform.reporting.domain.model.commands;

import java.time.LocalDate;

public record CreateConsumptionReportCommand(
        Long userId,
        LocalDate startDate,
        LocalDate endDate
) {
}