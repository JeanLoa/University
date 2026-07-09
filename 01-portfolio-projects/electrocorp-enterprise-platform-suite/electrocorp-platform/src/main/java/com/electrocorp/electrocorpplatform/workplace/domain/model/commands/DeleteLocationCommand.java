package com.electrocorp.electrocorpplatform.workplace.domain.model.commands;

public record DeleteLocationCommand(
        Long userId,
        Long locationId
) {
}