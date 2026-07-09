package com.electrocorp.electrocorpplatform.billing.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Invoice;
import com.electrocorp.electrocorpplatform.billing.domain.repositories.InvoiceRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaInvoiceRepository extends JpaRepository<Invoice, Long>, InvoiceRepository {
}
