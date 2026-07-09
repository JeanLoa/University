package com.electrocorp.electrocorpplatform.devicecontrol.application.results;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.aggregates.Routine;

public record RoutineDetails(
        Routine routine,
        String targetName,
        int applicableDeviceCount,
        int blockedDeviceCount
) {
}
