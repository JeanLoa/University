package com.electrocorp.electrocorpplatform.billing.infrastructure.persistence.jpa.repositories;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Payment;
import com.electrocorp.electrocorpplatform.billing.domain.repositories.PaymentRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPaymentRepository extends JpaRepository<Payment, Long>, PaymentRepository {
}
