package com.electrocorp.electrocorpplatform.reporting.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.reporting.domain.model.aggregates.EnergyGoal;
import com.electrocorp.electrocorpplatform.reporting.domain.repositories.EnergyGoalRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaEnergyGoalRepository extends JpaRepository<EnergyGoal, Long>, EnergyGoalRepository {
}
