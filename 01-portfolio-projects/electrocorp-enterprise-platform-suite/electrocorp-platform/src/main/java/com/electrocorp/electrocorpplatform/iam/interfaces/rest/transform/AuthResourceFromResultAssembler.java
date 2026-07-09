package com.electrocorp.electrocorpplatform.iam.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.iam.application.results.AuthenticationResult;
import com.electrocorp.electrocorpplatform.iam.interfaces.rest.resources.AuthResource;

public class AuthResourceFromResultAssembler {
    private AuthResourceFromResultAssembler() {
    }

    public static AuthResource toResourceFromResult(AuthenticationResult result) {
        return new AuthResource(
                UserResourceFromEntityAssembler.toResourceFromEntity(result.user()),
                result.token()
        );
    }
}