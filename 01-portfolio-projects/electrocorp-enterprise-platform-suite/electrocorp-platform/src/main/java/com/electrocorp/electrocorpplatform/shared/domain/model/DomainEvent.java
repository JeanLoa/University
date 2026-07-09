package com.electrocorp.electrocorpplatform.shared.domain.model;

import java.time.LocalDateTime;

public interface DomainEvent {
    LocalDateTime occurredOn();
}