package com.electrocorp.electrocorpplatform.energymonitoring.domain.model.events;

import com.electrocorp.electrocorpplatform.shared.domain.model.DomainEvent;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EnergyThresholdExceededEvent(Long userId, Long deviceId, BigDecimal watts, LocalDateTime occurredOn)
        implements DomainEvent {
    public EnergyThresholdExceededEvent(Long userId, Long deviceId, BigDecimal watts) {
        this(userId, deviceId, watts, LocalDateTime.now());
    }
}