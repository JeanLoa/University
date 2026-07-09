package com.electrocorp.electrocorpplatform.billing.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Payment;
import com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources.PaymentResource;

public class PaymentResourceFromEntityAssembler {
    private PaymentResourceFromEntityAssembler() {
    }

    public static PaymentResource toResourceFromEntity(Payment entity) {
        return PaymentResource.from(entity);
    }
}