package com.electrocorp.electrocorpplatform.reporting.domain.repositories;

import com.electrocorp.electrocorpplatform.reporting.domain.model.aggregates.EnergyGoal;

import java.util.List;
import java.util.Optional;

public interface EnergyGoalRepository {
    List<EnergyGoal> findByUserId(Long userId);

    Optional<EnergyGoal> findById(Long id);

    EnergyGoal save(EnergyGoal energyGoal);

    void delete(EnergyGoal energyGoal);
}
