package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

public record ToggleDeviceCommand(
        Long userId,
        Long deviceId
) {
}