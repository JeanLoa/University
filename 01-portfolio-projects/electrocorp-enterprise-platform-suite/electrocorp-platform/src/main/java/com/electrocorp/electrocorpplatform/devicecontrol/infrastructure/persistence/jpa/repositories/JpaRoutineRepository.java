package com.electrocorp.electrocorpplatform.devicecontrol.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.Routine;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.repositories.RoutineRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaRoutineRepository extends JpaRepository<Routine, Long>, RoutineRepository {
}
