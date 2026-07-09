package com.electrocorp.electrocorpplatform.energymonitoring.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.energymonitoring.domain.model.EnergyDeviceUsageState;
import com.electrocorp.electrocorpplatform.energymonitoring.domain.repositories.EnergyDeviceUsageStateRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaEnergyDeviceUsageStateRepository extends JpaRepository<EnergyDeviceUsageState, Long>, EnergyDeviceUsageStateRepository {
}
