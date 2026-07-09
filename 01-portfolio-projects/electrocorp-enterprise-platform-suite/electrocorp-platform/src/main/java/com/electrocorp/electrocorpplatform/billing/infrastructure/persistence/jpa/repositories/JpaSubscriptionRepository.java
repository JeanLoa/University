package com.electrocorp.electrocorpplatform.billing.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Subscription;
import com.electrocorp.electrocorpplatform.billing.domain.repositories.SubscriptionRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaSubscriptionRepository extends JpaRepository<Subscription, Long>, SubscriptionRepository {
}
