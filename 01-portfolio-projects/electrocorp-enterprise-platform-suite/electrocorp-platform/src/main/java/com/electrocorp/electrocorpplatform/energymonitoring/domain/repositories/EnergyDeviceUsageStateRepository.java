package com.electrocorp.electrocorpplatform.energymonitoring.domain.repositories;

import com.electrocorp.electrocorpplatform.energymonitoring.domain.model.EnergyDeviceUsageState;

import java.util.Optional;

public interface EnergyDeviceUsageStateRepository {
    Optional<EnergyDeviceUsageState> findByDeviceId(Long deviceId);

    void deleteByDeviceId(Long deviceId);

    EnergyDeviceUsageState save(EnergyDeviceUsageState energyDeviceUsageState);

    void delete(EnergyDeviceUsageState energyDeviceUsageState);
}
