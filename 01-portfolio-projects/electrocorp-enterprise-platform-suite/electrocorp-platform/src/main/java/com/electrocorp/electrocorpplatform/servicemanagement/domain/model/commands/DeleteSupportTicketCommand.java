package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.commands;

public record DeleteSupportTicketCommand(
        Long userId,
        Long ticketId
) {
}