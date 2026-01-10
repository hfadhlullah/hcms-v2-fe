package com.example.hcms.shift.exception;

/**
 * Exception thrown when a shift is not found
 */
public class ShiftNotFoundException extends RuntimeException {
    public ShiftNotFoundException(String message) {
        super(message);
    }

    public ShiftNotFoundException(Long shiftId) {
        super("Shift with ID " + shiftId + " not found");
    }
}
