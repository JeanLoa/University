package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

import java.math.BigDecimal;

public record UpdateDeviceCommand(
        Long userId,
        Long deviceId,
        String name,
        String room,
        String type,
        BigDecimal powerWatts
) {
}