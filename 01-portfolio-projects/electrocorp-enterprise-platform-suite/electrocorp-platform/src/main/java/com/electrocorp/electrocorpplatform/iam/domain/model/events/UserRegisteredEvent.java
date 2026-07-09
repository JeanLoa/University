package com.electrocorp.electrocorpplatform.iam.domain.model.events;

import com.electrocorp.electrocorpplatform.shared.domain.model.DomainEvent;

import java.time.LocalDateTime;

public record UserRegisteredEvent(Long userId, String email, LocalDateTime occurredOn) implements DomainEvent {
    public UserRegisteredEvent(Long userId, String email) {
        this(userId, email, LocalDateTime.now());
    }
}