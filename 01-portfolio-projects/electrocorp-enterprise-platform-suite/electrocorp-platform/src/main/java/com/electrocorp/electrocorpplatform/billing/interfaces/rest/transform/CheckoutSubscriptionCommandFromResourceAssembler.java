package com.electrocorp.electrocorpplatform.billing.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.billing.domain.model.commands.CheckoutSubscriptionCommand;
import com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources.CheckoutSubscriptionResource;

public class CheckoutSubscriptionCommandFromResourceAssembler {
    private CheckoutSubscriptionCommandFromResourceAssembler() {
    }

    public static CheckoutSubscriptionCommand toCommandFromResource(CheckoutSubscriptionResource resource, Long userId) {
        return new CheckoutSubscriptionCommand(
                userId,
                resource.planCode(),
                resource.holderName(),
                resource.cardNumber(),
                resource.expirationDate(),
                resource.cvv()
        );
    }
}
