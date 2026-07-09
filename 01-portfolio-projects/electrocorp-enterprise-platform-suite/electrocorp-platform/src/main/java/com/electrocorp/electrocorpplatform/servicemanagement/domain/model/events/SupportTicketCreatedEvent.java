package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.events;

import com.electrocorp.electrocorpplatform.shared.domain.model.DomainEvent;

import java.time.LocalDateTime;

public record SupportTicketCreatedEvent(Long userId, Long ticketId, String priority, LocalDateTime occurredOn)
        implements DomainEvent {
    public SupportTicketCreatedEvent(Long userId, Long ticketId, String priority) {
        this(userId, ticketId, priority, LocalDateTime.now());
    }
}