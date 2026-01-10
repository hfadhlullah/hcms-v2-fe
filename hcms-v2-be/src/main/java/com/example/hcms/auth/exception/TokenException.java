package com.example.hcms.auth.exception;

/**
 * Exception thrown when JWT token is invalid or expired
 */
public class TokenException extends RuntimeException {
    public TokenException(String message) {
        super(message);
    }

    public TokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
