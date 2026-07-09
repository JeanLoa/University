package com.electrocorp.electrocorpplatform.workplace.domain.model.commands;

public record CreateRoomCommand(
        Long locationId,
        String name,
        String floor
) {
}