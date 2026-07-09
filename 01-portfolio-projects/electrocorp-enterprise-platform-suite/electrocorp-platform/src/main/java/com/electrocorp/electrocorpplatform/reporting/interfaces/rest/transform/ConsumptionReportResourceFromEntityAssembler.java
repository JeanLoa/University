package com.electrocorp.electrocorpplatform.reporting.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.reporting.domain.model.aggregates.ConsumptionReport;
import com.electrocorp.electrocorpplatform.reporting.interfaces.rest.resources.ConsumptionReportResource;

public class ConsumptionReportResourceFromEntityAssembler {

    private ConsumptionReportResourceFromEntityAssembler() {
    }

    public static ConsumptionReportResource toResourceFromEntity(ConsumptionReport entity) {
        return ConsumptionReportResource.from(entity);
    }
}