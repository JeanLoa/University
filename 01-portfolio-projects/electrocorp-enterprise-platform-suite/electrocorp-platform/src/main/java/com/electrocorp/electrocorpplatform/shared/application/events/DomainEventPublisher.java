package com.electrocorp.electrocorpplatform.shared.application.events;

import com.electrocorp.electrocorpplatform.shared.domain.model.DomainEvent;

public interface DomainEventPublisher {
    void publish(DomainEvent event);
}
