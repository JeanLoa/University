package com.electrocorp.electrocorpplatform.workplace.interfaces.rest.resources;

import com.electrocorp.electrocorpplatform.workplace.domain.model.aggregates.DeviceAssignment;

import java.time.LocalDateTime;

public record DeviceAssignmentResource(
        Long id,
        Long deviceId,
        Long roomId,
        Long locationId,
        LocalDateTime assignedAt
) {
    public static DeviceAssignmentResource from(DeviceAssignment assignment) {
        return new DeviceAssignmentResource(
                assignment.getId(),
                assignment.getDeviceId(),
                assignment.getRoomId(),
                assignment.getLocationId(),
                assignment.getAssignedAt()
        );
    }
}