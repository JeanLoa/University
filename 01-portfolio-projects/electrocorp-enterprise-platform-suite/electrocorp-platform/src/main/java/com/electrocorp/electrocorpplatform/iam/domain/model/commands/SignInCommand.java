package com.electrocorp.electrocorpplatform.iam.domain.model.commands;

public record SignInCommand(
        String email,
        String password
) {
}