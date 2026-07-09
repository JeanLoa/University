package com.electrocorp.electrocorpplatform.billing.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Subscription;
import com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources.SubscriptionResource;

public class SubscriptionResourceFromEntityAssembler {
    private SubscriptionResourceFromEntityAssembler() {
    }

    public static SubscriptionResource toResourceFromEntity(Subscription entity) {
        return entity == null ? null : SubscriptionResource.from(entity);
    }
}