package com.electrocorp.electrocorpplatform.reporting.domain.model.commands;

public record DeleteEnergyGoalCommand(
        Long userId,
        Long goalId
) {
}