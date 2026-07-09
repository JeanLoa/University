package com.electrocorp.electrocorpplatform.notifications.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRule;
import com.electrocorp.electrocorpplatform.notifications.domain.repositories.AlertRuleRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaAlertRuleRepository extends JpaRepository<AlertRule, Long>, AlertRuleRepository {
}
