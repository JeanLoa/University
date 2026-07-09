package com.electrocorp.electrocorpplatform.shared.interfaces.rest.resources;

public record ApiResource<T>(
        boolean success,
        String message,
        T data
) {
}