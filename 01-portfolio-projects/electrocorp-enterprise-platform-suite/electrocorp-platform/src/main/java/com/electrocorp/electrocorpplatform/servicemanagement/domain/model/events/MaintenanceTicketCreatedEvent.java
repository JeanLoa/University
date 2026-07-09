package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.events;

import com.electrocorp.electrocorpplatform.shared.domain.model.DomainEvent;

import java.time.LocalDateTime;

public record MaintenanceTicketCreatedEvent(Long userId, Long ticketId, Long deviceId, LocalDateTime occurredOn)
        implements DomainEvent {
    public MaintenanceTicketCreatedEvent(Long userId, Long ticketId, Long deviceId) {
        this(userId, ticketId, deviceId, LocalDateTime.now());
    }
}