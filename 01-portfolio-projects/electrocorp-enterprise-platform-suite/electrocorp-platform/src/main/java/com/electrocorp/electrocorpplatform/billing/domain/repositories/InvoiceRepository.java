package com.electrocorp.electrocorpplatform.billing.domain.repositories;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Invoice;

import java.util.List;

public interface InvoiceRepository {
    List<Invoice> findByUserId(Long userId);

    Invoice save(Invoice invoice);
}
