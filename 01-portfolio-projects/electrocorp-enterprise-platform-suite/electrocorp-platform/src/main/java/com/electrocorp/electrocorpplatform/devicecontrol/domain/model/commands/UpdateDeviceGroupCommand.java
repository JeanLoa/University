package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

import java.util.List;

public record UpdateDeviceGroupCommand(
        String name,
        String description,
        List<Long> deviceIds
) {
}