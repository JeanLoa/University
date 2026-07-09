package com.electrocorp.electrocorpplatform.billing.application.queryservices;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Invoice;
import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Payment;
import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Plan;
import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Subscription;
import com.electrocorp.electrocorpplatform.billing.domain.model.queries.GetAllPlansQuery;
import com.electrocorp.electrocorpplatform.billing.domain.model.queries.GetCurrentSubscriptionQuery;
import com.electrocorp.electrocorpplatform.billing.domain.model.queries.GetInvoicesByUserQuery;
import com.electrocorp.electrocorpplatform.billing.domain.model.queries.GetPaymentsByUserQuery;

import java.util.List;
import java.util.Optional;

public interface BillingQueryService {
    List<Plan> handle(GetAllPlansQuery query);
    Optional<Subscription> handle(GetCurrentSubscriptionQuery query);
    List<Payment> handle(GetPaymentsByUserQuery query);
    List<Invoice> handle(GetInvoicesByUserQuery query);
}