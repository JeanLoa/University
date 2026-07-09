package com.electrocorp.electrocorpplatform.devicecontrol.domain.repositories;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.entities.DeviceGroupDevice;

import java.util.List;

public interface DeviceGroupDeviceRepository {
    List<DeviceGroupDevice> findByDeviceGroupId(Long deviceGroupId);

    DeviceGroupDevice save(DeviceGroupDevice relation);

    void deleteByDeviceGroupId(Long deviceGroupId);

    void deleteByDeviceId(Long deviceId);
}
