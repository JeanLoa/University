package com.electrocorp.electrocorpplatform.iam.infrastructure.security;

import org.springframework.stereotype.Service;
import com.electrocorp.electrocorpplatform.shared.infrastructure.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentSessionService {

    private final CurrentUserProvider currentUserProvider;

    public Long getCurrentUserIdOrDefault() {
        return currentUserProvider.getCurrentUserId();
    }
}
