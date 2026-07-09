package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.Room;

import java.time.LocalDate;

public record RoomResource(
        Long id,
        Long locationId,
        String name,
        String floor,
        LocalDate createdAt
) {
    public static RoomResource from(Room room) {
        return new RoomResource(
                room.getId(),
                room.getLocationId(),
                room.getName(),
                room.getFloor(),
                room.getCreatedAt() != null ? room.getCreatedAt().toLocalDate() : null
        );
    }
}
