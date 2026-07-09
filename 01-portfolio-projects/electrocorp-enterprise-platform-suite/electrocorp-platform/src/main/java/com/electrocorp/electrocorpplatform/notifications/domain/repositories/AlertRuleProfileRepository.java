package com.electrocorp.electrocorpplatform.notifications.domain.repositories;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRuleProfile;

import java.util.List;
import java.util.Optional;

public interface AlertRuleProfileRepository {
    List<AlertRuleProfile> findByUserId(Long userId);

    Optional<AlertRuleProfile> findByIdAndUserId(Long id, Long userId);

    AlertRuleProfile save(AlertRuleProfile alertRuleProfile);
}
