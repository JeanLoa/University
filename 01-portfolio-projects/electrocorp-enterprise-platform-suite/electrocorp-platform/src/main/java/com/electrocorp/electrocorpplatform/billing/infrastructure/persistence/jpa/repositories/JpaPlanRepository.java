package com.electrocorp.electrocorpplatform.billing.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Plan;
import com.electrocorp.electrocorpplatform.billing.domain.repositories.PlanRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPlanRepository extends JpaRepository<Plan, Long>, PlanRepository {
}
