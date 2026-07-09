package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

public record AddDeviceToGroupCommand(
        Long userId,
        Long deviceGroupId,
        Long deviceId
) {
}