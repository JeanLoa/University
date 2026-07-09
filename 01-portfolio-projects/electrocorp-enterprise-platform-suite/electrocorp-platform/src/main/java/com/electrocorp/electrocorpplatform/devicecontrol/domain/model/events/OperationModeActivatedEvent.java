package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.events;

import com.electrocorp.electrocorpplatform.shared.domain.model.DomainEvent;

import java.time.LocalDateTime;

public record OperationModeActivatedEvent(
        Long userId,
        Long modeId,
        String modeName,
        String evidence,
        String explanation,
        String recommendedAction,
        LocalDateTime occurredOn
) implements DomainEvent {
    public OperationModeActivatedEvent(
            Long userId,
            Long modeId,
            String modeName,
            String evidence,
            String explanation,
            String recommendedAction
    ) {
        this(userId, modeId, modeName, evidence, explanation, recommendedAction, LocalDateTime.now());
    }
}
