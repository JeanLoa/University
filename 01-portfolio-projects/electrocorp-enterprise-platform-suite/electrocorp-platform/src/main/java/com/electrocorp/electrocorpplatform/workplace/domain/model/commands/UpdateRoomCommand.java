package com.electrocorp.electrocorpplatform.workplace.domain.model.commands;

public record UpdateRoomCommand(
        Long roomId,
        Long locationId,
        String name,
        String floor
) {
}