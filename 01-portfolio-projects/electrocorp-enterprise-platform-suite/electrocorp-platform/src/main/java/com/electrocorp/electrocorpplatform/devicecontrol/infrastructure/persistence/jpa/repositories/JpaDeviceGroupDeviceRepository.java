package com.electrocorp.electrocorpplatform.devicecontrol.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.entities.DeviceGroupDevice;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.repositories.DeviceGroupDeviceRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaDeviceGroupDeviceRepository extends JpaRepository<DeviceGroupDevice, Long>, DeviceGroupDeviceRepository {
}
