package com.electrocorp.electrocorpplatform.iam.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.iam.domain.model.commands.SignUpCommand;
import com.electrocorp.electrocorpplatform.iam.interfaces.rest.resources.SignUpResource;

public class SignUpCommandFromResourceAssembler {
    private SignUpCommandFromResourceAssembler() {
    }

    public static SignUpCommand toCommandFromResource(SignUpResource resource) {
        return new SignUpCommand(resource.fullName(), resource.email(), resource.password());
    }
}