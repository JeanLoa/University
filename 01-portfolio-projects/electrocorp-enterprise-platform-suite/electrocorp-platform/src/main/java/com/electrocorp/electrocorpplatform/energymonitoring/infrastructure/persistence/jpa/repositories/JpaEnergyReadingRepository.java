package com.electrocorp.electrocorpplatform.energymonitoring.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.energymonitoring.domain.model.aggregates.EnergyReading;
import com.electrocorp.electrocorpplatform.energymonitoring.domain.repositories.EnergyReadingRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaEnergyReadingRepository extends JpaRepository<EnergyReading, Long>, EnergyReadingRepository {
}
