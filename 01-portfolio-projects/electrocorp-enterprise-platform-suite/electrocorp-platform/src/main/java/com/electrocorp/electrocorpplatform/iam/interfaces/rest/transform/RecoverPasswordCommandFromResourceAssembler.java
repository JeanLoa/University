package com.electrocorp.electrocorpplatform.iam.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.iam.domain.model.commands.RecoverPasswordCommand;
import com.electrocorp.electrocorpplatform.iam.interfaces.rest.resources.RecoverPasswordResource;

public class RecoverPasswordCommandFromResourceAssembler {
    private RecoverPasswordCommandFromResourceAssembler() {
    }

    public static RecoverPasswordCommand toCommandFromResource(RecoverPasswordResource resource) {
        return new RecoverPasswordCommand(resource.email());
    }
}