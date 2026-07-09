package com.electrocorp.electrocorpplatform.reporting.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.reporting.domain.model.commands.CreateConsumptionReportCommand;
import com.electrocorp.electrocorpplatform.reporting.interfaces.rest.resources.CreateConsumptionReportResource;

public class CreateConsumptionReportCommandFromResourceAssembler {

    private CreateConsumptionReportCommandFromResourceAssembler() {
    }

    public static CreateConsumptionReportCommand toCommandFromResource(CreateConsumptionReportResource resource, Long userId) {
        return new CreateConsumptionReportCommand(
                userId,
                resource.startDate(),
                resource.endDate()
        );
    }
}
