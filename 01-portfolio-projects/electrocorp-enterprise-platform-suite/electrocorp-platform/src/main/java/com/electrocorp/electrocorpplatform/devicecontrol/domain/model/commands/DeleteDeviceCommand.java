package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

public record DeleteDeviceCommand(
        Long userId,
        Long deviceId
) {
}