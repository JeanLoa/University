package com.electrocorp.electrocorpplatform.servicemanagement.domain.repositories;

import com.electrocorp.electrocorpplatform.servicemanagement.domain.model.aggregates.MaintenanceTicket;

import java.util.List;
import java.util.Optional;

public interface MaintenanceTicketRepository {
    List<MaintenanceTicket> findByUserId(Long userId);

    Optional<MaintenanceTicket> findById(Long id);

    MaintenanceTicket save(MaintenanceTicket maintenanceTicket);

    void delete(MaintenanceTicket maintenanceTicket);
}
