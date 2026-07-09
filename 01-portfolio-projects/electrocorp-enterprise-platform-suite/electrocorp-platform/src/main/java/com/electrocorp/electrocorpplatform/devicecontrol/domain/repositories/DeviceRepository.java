package com.electrocorp.electrocorpplatform.devicecontrol.domain.repositories;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.Device;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository {
    List<Device> findAll();

    List<Device> findByUserId(Long userId);

    Optional<Device> findByIdAndUserId(Long id, Long userId);

    Optional<Device> findById(Long id);

    Device save(Device device);
}
