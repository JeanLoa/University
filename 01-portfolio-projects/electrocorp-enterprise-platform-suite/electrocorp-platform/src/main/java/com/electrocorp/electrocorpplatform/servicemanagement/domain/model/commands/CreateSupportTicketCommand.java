package com.electrocorp.electrocorpplatform.servicemanagement.domain.model.commands;

public record CreateSupportTicketCommand(
        Long userId,
        String subject,
        String description,
        String priority
) {
}