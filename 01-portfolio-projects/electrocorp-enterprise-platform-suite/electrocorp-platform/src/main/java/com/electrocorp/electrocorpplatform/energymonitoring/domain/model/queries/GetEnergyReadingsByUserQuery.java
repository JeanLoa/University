package com.electrocorp.electrocorpplatform.energymonitoring.domain.model.queries;

import java.time.LocalDateTime;

public record GetEnergyReadingsByUserQuery(
        Long userId,
        LocalDateTime start,
        LocalDateTime end
) {
}
