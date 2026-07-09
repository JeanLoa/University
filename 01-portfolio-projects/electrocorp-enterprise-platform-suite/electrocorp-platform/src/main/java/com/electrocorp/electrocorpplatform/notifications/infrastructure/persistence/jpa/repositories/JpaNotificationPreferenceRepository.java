package com.electrocorp.electrocorpplatform.notifications.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.NotificationPreference;
import com.electrocorp.electrocorpplatform.notifications.domain.repositories.NotificationPreferenceRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaNotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long>, NotificationPreferenceRepository {
}
