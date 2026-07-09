package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

public record ToggleRoutineCommand(
        Long userId,
        Long routineId
) {
}