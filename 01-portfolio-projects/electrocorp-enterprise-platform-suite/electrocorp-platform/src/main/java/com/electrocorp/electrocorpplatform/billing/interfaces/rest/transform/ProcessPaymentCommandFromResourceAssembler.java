package com.electrocorp.electrocorpplatform.billing.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.billing.domain.model.commands.ProcessPaymentCommand;
import com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources.ProcessPaymentResource;

public class ProcessPaymentCommandFromResourceAssembler {
    private ProcessPaymentCommandFromResourceAssembler() {
    }

    public static ProcessPaymentCommand toCommandFromResource(ProcessPaymentResource resource, Long userId) {
        return new ProcessPaymentCommand(userId, resource.subscriptionId());
    }
}
