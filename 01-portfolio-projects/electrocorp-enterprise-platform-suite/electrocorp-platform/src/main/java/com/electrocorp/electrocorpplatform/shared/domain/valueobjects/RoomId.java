package com.electrocorp.electrocorpplatform.shared.domain.valueobjects;

public record RoomId(Long value) {
    public RoomId {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("Room id must be positive.");
        }
    }
}