package com.electrocorp.electrocorpplatform.iam.interfaces.rest.resources;

public record AuthResource(
        UserResource user,
        String token
) {
}