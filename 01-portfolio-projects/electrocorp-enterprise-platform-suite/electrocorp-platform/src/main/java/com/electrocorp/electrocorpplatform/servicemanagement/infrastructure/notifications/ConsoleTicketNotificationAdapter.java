package com.electrocorp.electrocorpplatform.servicemanagement.infrastructure.notifications;

import org.springframework.stereotype.Component;

@Component
public class ConsoleTicketNotificationAdapter implements TicketNotificationPort {

    @Override
    public void notifyTicketCreated(Long userId, Long ticketId, String ticketType) {
        System.out.println("[ElectroCorp Ticket] Created " + ticketType + " ticket " + ticketId + " for user " + userId);
    }

    @Override
    public void notifyTicketStatusChanged(Long userId, Long ticketId, String status) {
        System.out.println("[ElectroCorp Ticket] Ticket " + ticketId + " changed status to " + status + " for user " + userId);
    }
}