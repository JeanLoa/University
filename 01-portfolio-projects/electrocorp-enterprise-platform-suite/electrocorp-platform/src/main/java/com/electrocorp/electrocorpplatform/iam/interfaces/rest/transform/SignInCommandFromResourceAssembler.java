package com.electrocorp.electrocorpplatform.iam.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.iam.domain.model.commands.SignInCommand;
import com.electrocorp.electrocorpplatform.iam.interfaces.rest.resources.SignInResource;

public class SignInCommandFromResourceAssembler {
    private SignInCommandFromResourceAssembler() {
    }

    public static SignInCommand toCommandFromResource(SignInResource resource) {
        return new SignInCommand(resource.email(), resource.password());
    }
}