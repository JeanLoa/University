package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

public record DeleteDeviceGroupCommand(
        Long userId,
        Long deviceGroupId
) {
}