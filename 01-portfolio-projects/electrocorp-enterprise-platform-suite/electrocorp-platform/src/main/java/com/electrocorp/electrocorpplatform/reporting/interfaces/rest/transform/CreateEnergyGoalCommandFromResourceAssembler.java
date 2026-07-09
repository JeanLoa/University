package com.electrocorp.electrocorpplatform.reporting.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.reporting.domain.model.commands.CreateEnergyGoalCommand;
import com.electrocorp.electrocorpplatform.reporting.interfaces.rest.resources.CreateEnergyGoalResource;

public class CreateEnergyGoalCommandFromResourceAssembler {

    private CreateEnergyGoalCommandFromResourceAssembler() {
    }

    public static CreateEnergyGoalCommand toCommandFromResource(CreateEnergyGoalResource resource, Long userId) {
        var targetKilowattHours = resource.effectiveTargetKilowattHours();
        if (targetKilowattHours == null || targetKilowattHours.signum() <= 0) {
            throw new IllegalArgumentException("Target kilowatt hours must be greater than zero.");
        }

        return new CreateEnergyGoalCommand(
                userId,
                resource.title(),
                targetKilowattHours,
                resource.deadline(),
                resource.scopeType(),
                resource.scopeId(),
                resource.scopeName(),
                resource.activeFrom(),
                resource.activeTo()
        );
    }
}
