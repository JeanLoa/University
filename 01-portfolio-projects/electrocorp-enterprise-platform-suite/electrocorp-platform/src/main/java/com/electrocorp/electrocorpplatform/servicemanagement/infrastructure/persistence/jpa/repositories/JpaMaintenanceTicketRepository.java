package com.electrocorp.electrocorpplatform.servicemanagement.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.servicemanagement.domain.model.aggregates.MaintenanceTicket;
import com.electrocorp.electrocorpplatform.servicemanagement.domain.repositories.MaintenanceTicketRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaMaintenanceTicketRepository extends JpaRepository<MaintenanceTicket, Long>, MaintenanceTicketRepository {
}
