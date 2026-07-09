package com.electrocorp.electrocorpplatform.notifications.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.AlertRuleProfile;
import com.electrocorp.electrocorpplatform.notifications.domain.repositories.AlertRuleProfileRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaAlertRuleProfileRepository extends JpaRepository<AlertRuleProfile, Long>, AlertRuleProfileRepository {
}
