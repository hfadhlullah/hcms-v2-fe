package com.example.hcms.common.error;

import com.example.hcms.auth.exception.InvalidCredentialsException;
import com.example.hcms.auth.exception.RateLimitExceededException;
import com.example.hcms.shift.exception.DuplicateShiftCodeException;
import com.example.hcms.shift.exception.ShiftNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.UUID;

/**
 * Global exception handler for REST API
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex, WebRequest request) {
        String traceId = UUID.randomUUID().toString();
        ErrorResponse error = new ErrorResponse(
                "INVALID_CREDENTIALS",
                ex.getMessage(),
                traceId
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleRateLimitExceeded(RateLimitExceededException ex, WebRequest request) {
        String traceId = UUID.randomUUID().toString();
        ErrorResponse error = new ErrorResponse(
                "RATE_LIMIT_EXCEEDED",
                ex.getMessage(),
                traceId
        );
        ResponseEntity<ErrorResponse> response = ResponseEntity
                .status(HttpStatus.TOO_MANY_REQUESTS)
                .header("Retry-After", String.valueOf(ex.getRetryAfterSeconds()))
                .body(error);
        return response;
    }

    @ExceptionHandler(ShiftNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleShiftNotFound(ShiftNotFoundException ex, WebRequest request) {
        String traceId = UUID.randomUUID().toString();
        ErrorResponse error = new ErrorResponse(
                "SHIFT_NOT_FOUND",
                ex.getMessage(),
                traceId
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DuplicateShiftCodeException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateShiftCode(DuplicateShiftCodeException ex, WebRequest request) {
        String traceId = UUID.randomUUID().toString();
        ErrorResponse error = new ErrorResponse(
                "DUPLICATE_SHIFT_CODE",
                ex.getMessage(),
                traceId
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, WebRequest request) {
        String traceId = UUID.randomUUID().toString();
        StringBuilder details = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                details.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ")
        );

        ErrorResponse error = new ErrorResponse(
                "VALIDATION_ERROR",
                "Input validation failed",
                details.toString(),
                traceId
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, WebRequest request) {
        String traceId = UUID.randomUUID().toString();
        ErrorResponse error = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "An unexpected error occurred",
                traceId
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
