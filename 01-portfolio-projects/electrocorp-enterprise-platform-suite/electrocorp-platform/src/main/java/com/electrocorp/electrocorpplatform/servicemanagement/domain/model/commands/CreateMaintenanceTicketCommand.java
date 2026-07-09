package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.commands;

import java.time.LocalDate;

public record CreateMaintenanceTicketCommand(
        Long userId,
        Long deviceId,
        String deviceName,
        String type,
        String description,
        LocalDate scheduledDate
) {
}