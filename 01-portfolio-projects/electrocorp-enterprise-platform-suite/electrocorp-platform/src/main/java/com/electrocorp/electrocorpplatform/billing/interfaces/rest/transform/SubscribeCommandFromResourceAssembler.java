package com.electrocorp.electrocorpplatform.billing.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.billing.domain.model.commands.SubscribeCommand;
import com.electrocorp.electrocorpplatform.billing.interfaces.rest.resources.SubscribeResource;

public class SubscribeCommandFromResourceAssembler {
    private SubscribeCommandFromResourceAssembler() {
    }

    public static SubscribeCommand toCommandFromResource(SubscribeResource resource, Long userId) {
        return new SubscribeCommand(userId, resource.planCode());
    }
}
