package com.electrocorp.electrocorpplatform.workplace.domain.model.commands;

public record AssignDeviceCommand(
        Long deviceId,
        Long roomId,
        Long locationId
) {
}