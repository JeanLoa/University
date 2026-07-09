package com.electrocorp.electrocorpplatform.shared.domain.exceptions;

public class ConflictException extends DomainException {
    public ConflictException(String message) {
        super(message);
    }
}