package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

public record ExecuteRoutineCommand(
        Long userId,
        Long routineId
) {
}
