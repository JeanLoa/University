package com.electrocorp.electrocorpplatform.reporting.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.reporting.domain.model.aggregates.EnergyGoal;
import com.electrocorp.electrocorpplatform.reporting.interfaces.rest.resources.EnergyGoalResource;

public class EnergyGoalResourceFromEntityAssembler {

    private EnergyGoalResourceFromEntityAssembler() {
    }

    public static EnergyGoalResource toResourceFromEntity(EnergyGoal entity) {
        return EnergyGoalResource.from(entity);
    }
}