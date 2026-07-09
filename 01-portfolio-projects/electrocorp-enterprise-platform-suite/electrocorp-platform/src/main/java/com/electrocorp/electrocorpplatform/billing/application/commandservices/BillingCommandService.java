package com.electrocorp.electrocorpplatform.billing.application.commandservices;

import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Payment;
import com.electrocorp.electrocorpplatform.billing.domain.model.aggregates.Subscription;
import com.electrocorp.electrocorpplatform.billing.domain.model.commands.CancelSubscriptionCommand;
import com.electrocorp.electrocorpplatform.billing.domain.model.commands.CheckoutSubscriptionCommand;
import com.electrocorp.electrocorpplatform.billing.domain.model.commands.ProcessPaymentCommand;

public interface BillingCommandService {
    Subscription handle(CheckoutSubscriptionCommand command);
    void handle(CancelSubscriptionCommand command);
    Payment handle(ProcessPaymentCommand command);
}
