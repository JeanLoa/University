package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.DeviceStatus;

public record ExecuteGroupActionCommand(DeviceStatus status) {
}