package com.electrocorp.electrocorpplatform.reporting.interfaces.rest.resources;

import com.electrocorp.electrocorpplatform.reporting.domain.model.aggregates.ConsumptionReport;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ConsumptionReportResource(
        Long id,
        Long userId,
        BigDecimal totalWatts,
        BigDecimal averageWatts,
        BigDecimal highestWatts,
        LocalDate startDate,
        LocalDate endDate
) {
    public static ConsumptionReportResource from(ConsumptionReport report) {
        return new ConsumptionReportResource(
                report.getId(),
                report.getUserId(),
                report.getTotalWatts(),
                report.getAverageWatts(),
                report.getHighestWatts(),
                report.getStartDate(),
                report.getEndDate()
        );
    }
}