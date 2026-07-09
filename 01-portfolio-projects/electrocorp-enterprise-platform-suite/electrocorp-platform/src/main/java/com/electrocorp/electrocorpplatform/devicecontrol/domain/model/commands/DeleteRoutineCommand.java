package com.electrocorp.electrocorpplatform.devicecontrol.domain.model.commands;

public record DeleteRoutineCommand(
        Long userId,
        Long routineId
) {
}