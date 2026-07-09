package com.electrocorp.electrocorpplatform.notifications.domain.repositories;

import com.electrocorp.electrocorpplatform.notifications.domain.model.aggregates.NotificationPreference;

import java.util.Optional;

public interface NotificationPreferenceRepository {
    Optional<NotificationPreference> findByUserId(Long userId);

    Optional<NotificationPreference> findById(Long id);

    NotificationPreference save(NotificationPreference notificationPreference);
}
