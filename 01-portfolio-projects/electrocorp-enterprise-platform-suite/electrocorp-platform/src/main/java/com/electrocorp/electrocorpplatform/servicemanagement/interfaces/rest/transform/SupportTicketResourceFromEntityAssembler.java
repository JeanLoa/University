package com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.servicemanagement.domain.model.aggregates.SupportTicket;
import com.electrocorp.electrocorpplatform.servicemanagement.interfaces.rest.resources.SupportTicketResource;

public class SupportTicketResourceFromEntityAssembler {
    public static SupportTicketResource toResourceFromEntity(SupportTicket ticket) {
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
