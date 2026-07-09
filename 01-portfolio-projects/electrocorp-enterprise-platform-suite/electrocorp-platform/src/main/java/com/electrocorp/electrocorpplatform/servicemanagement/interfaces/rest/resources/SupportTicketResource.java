package com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.resources;

import com.electrocorp.electrocorpplatform.servicemanagement.domain.model.aggregates.SupportTicket;

import java.time.LocalDate;

public record SupportTicketResource(
        Long id,
        Long userId,
        String subject,
        String description,
        String priority,
        String status,
        LocalDate createdAt
) {
    public static SupportTicketResource from(SupportTicket ticket) {
        return new SupportTicketResource(
                ticket.getId(),
                ticket.getUserId(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatedAt() != null ? ticket.getCreatedAt().toLocalDate() : null
        );
    }
}
