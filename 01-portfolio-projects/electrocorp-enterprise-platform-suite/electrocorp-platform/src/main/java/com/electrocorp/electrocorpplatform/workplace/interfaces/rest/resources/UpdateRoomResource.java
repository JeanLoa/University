package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources;

public record UpdateRoomResource(
        Long locationId,
        String name,
        String floor
) {
}