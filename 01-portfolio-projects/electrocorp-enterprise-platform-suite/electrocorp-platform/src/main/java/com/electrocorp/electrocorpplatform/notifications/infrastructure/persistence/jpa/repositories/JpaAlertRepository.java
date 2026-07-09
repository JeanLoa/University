package com.electrocorp.electrocorpplatform.notifications.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.Alert;
import com.electrocorp.electrocorpplatform.notifications.domain.repositories.AlertRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaAlertRepository extends JpaRepository<Alert, Long>, AlertRepository {
}
