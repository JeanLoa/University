package com.electrocorp.electrocorpplatform.devicecontrol.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.DeviceGroup;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.repositories.DeviceGroupRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaDeviceGroupRepository extends JpaRepository<DeviceGroup, Long>, DeviceGroupRepository {
}
