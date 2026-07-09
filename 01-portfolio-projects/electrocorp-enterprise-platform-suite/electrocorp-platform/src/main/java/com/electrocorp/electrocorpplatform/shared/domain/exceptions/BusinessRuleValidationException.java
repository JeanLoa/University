package com.electrocorp.electrocorpplatform.shared.domain.exceptions;

public class BusinessRuleValidationException extends DomainException {
    public BusinessRuleValidationException(String message) {
        super(message);
    }
}