package com.electrocorp.electrocorpplatform.devicecontrol.application.results;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.DeviceGroup;

import java.util.List;

public record DeviceGroupDetails(DeviceGroup group, List<Long> deviceIds) {
}