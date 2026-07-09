package com.electrocorp.electrocorpplatform.billing.domain.model.events;

import com.electrocorp.electrocorpplatform.shared.domain.model.DomainEvent;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentRegisteredEvent(Long userId, Long paymentId, BigDecimal amount, LocalDateTime occurredOn)
        implements DomainEvent {
    public PaymentRegisteredEvent(Long userId, Long paymentId, BigDecimal amount) {
        this(userId, paymentId, amount, LocalDateTime.now());
    }
}