package com.electrocorp.electrocorpplatform.devicecontrol.interfaces.rest.resources;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.DeviceStatus;
import jakarta.validation.constraints.NotNull;

public record ExecuteGroupActionResource(
        @NotNull DeviceStatus status
) {
}