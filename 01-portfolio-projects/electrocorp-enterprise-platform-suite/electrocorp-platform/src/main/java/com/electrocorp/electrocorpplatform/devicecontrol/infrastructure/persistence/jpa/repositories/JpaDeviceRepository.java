package com.electrocorp.electrocorpplatform.devicecontrol.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.Device;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.repositories.DeviceRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaDeviceRepository extends JpaRepository<Device, Long>, DeviceRepository {
}
