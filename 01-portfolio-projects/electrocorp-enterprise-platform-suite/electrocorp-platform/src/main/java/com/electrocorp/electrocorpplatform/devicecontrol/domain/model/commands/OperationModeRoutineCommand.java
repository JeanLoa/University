package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.RoutineAction;
import com.electrocorp.electrocorpplatform.devicecontrol.domain.model.RoutineTargetType;

public record OperationModeRoutineCommand(
        String name,
        RoutineTargetType targetType,
        Long targetId,
        RoutineAction action,
        String triggerTime,
        Boolean enabled
) {
}
