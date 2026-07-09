package com.electrocorp.electrocorpplatform.iam.domain.model.commands;

public record UpdateProfileCommand(
        String fullName,
        String email
) {
}