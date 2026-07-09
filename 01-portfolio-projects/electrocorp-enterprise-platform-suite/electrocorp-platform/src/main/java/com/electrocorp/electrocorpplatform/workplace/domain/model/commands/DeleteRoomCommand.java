package com.electrocorp.electrocorpplatform.workplace.domain.model.commands;

public record DeleteRoomCommand(
        Long roomId,
        Long locationId
) {
}