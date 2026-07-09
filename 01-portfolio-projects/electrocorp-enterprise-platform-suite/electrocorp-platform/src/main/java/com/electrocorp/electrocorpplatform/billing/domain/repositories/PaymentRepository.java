package com.electrocorp.electrocorpplatform.billing.domain.repositories;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Payment;

import java.util.List;

public interface PaymentRepository {
    List<Payment> findByUserId(Long userId);

    Payment save(Payment payment);
}
