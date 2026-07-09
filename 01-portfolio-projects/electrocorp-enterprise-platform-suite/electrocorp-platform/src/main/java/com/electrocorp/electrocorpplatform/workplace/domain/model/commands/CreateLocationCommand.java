package com.electrocorp.electrocorpplatform.workplace.domain.model.commands;

public record CreateLocationCommand(
        Long userId,
        String name,
        String address,
        String type
) {
}