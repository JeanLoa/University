package com.electrocorp.electrocorpplatform.notifications.domain.model.results;

import com.electrocorp.electrocorpplatform.notifications.domain.model.valueobjects.AlertEventType;
import com.electrocorp.electrocorpplatform.notifications.domain.model.valueobjects.AlertLevel;
import com.electrocorp.electrocorpplatform.notifications.domain.model.valueobjects.AlertSourceType;
import com.electrocorp.electrocorpplatform.notifications.domain.model.valueobjects.RuleScopeType;

public record RuleEvaluationResult(
        Long userId,
        RuleScopeType scopeType,
        String scopeId,
        AlertLevel level,
        Integer severityScore,
        String evidence,
        String explanation,
        String recommendedAction,
        AlertSourceType sourceType,
        String sourceId,
        AlertEventType eventType,
        String threadKey,
        Integer activeEvaluatorCount,
        Integer totalWeight
) {
}
