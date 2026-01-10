package com.example.hcms.shift.exception;

/**
 * Exception thrown when attempting to create a shift with a duplicate code
 */
public class DuplicateShiftCodeException extends RuntimeException {
    public DuplicateShiftCodeException(String code) {
        super("A shift with code '" + code + "' already exists");
    }
}
