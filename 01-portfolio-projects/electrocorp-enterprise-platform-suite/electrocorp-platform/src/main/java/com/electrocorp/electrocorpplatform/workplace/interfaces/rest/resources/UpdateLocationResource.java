package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources;

public record UpdateLocationResource(
        String name,
        String address,
        String type
) {
}