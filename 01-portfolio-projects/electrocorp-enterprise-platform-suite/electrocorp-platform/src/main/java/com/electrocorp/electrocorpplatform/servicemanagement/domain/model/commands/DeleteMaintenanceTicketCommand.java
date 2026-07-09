package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.commands;

public record DeleteMaintenanceTicketCommand(
        Long userId,
        Long ticketId
) {
}