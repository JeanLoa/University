package com.electrocorp.electrocorpplatform.billing.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Plan;
import com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources.PlanResource;

public class PlanResourceFromEntityAssembler {
    private PlanResourceFromEntityAssembler() {
    }

    public static PlanResource toResourceFromEntity(Plan entity) {
        return PlanResource.from(entity);
    }
}