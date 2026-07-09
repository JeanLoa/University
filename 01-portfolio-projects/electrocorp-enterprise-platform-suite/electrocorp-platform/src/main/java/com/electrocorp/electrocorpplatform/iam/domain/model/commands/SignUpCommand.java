package com.electrocorp.electrocorpplatform.iam.domain.model.commands;

public record SignUpCommand(
        String fullName,
        String email,
        String password
) {
}