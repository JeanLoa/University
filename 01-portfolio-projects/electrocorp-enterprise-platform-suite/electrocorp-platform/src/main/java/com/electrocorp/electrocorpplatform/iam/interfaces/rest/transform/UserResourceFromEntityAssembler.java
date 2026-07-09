package com.electrocorp.electrocorpplatform.iam.interfaces.rest.transform;

import com.electrocorp.electrocorpplatform.iam.domain.model.aggregates.User;
import com.electrocorp.electrocorpplatform.iam.interfaces.rest.resources.UserResource;

public class UserResourceFromEntityAssembler {
    private UserResourceFromEntityAssembler() {
    }

    public static UserResource toResourceFromEntity(User entity) {
        return UserResource.from(entity);
    }
}