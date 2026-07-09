package com.electrocorp.electrocorpplatform.iam.application.results;

import com.electrocorp.electrocorpplatform.iam.domain.model.aggregates.User;

public record AuthenticationResult(
        User user,
        String token
) {
}