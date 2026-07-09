package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.commands;

import java.time.LocalDate;

public record ScheduleMaintenanceTicketCommand(
        Long userId,
        Long ticketId,
        LocalDate scheduledDate
) {
}