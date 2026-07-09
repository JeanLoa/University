package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.Location;

import java.time.LocalDate;

public record LocationResource(
        Long id,
        Long userId,
        String name,
        String address,
        String type,
        LocalDate createdAt
) {
    public static LocationResource from(Location location) {
        return new LocationResource(
                location.getId(),
                location.getUserId(),
                location.getName(),
                location.getAddress(),
                location.getType(),
                location.getCreatedAt() != null ? location.getCreatedAt().toLocalDate() : null
        );
    }
}
