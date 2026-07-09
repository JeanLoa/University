package com.electrocorp.electrocorpplatform.servicemanagement.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.servicemanagement.domain.model.aggregates.SupportTicket;
import com.electrocorp.electrocorpplatform.servicemanagement.domain.repositories.SupportTicketRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaSupportTicketRepository extends JpaRepository<SupportTicket, Long>, SupportTicketRepository {
}
