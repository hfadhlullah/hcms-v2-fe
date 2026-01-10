package com.example.hcms.auth.security;

import com.example.hcms.auth.exception.RateLimitExceededException;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory rate limiter for login attempts
 * Tracks failed login attempts by IP address.
 * Limits to 5 attempts per minute; 6th attempt raises exception.
 */
@Component
public class LoginRateLimiter {

    private static final int MAX_ATTEMPTS = 5;
    private static final long WINDOW_MINUTES = 1;
    private static final String ATTEMPTS_KEY_PREFIX = "login_attempts:";

    // In-memory store: key = "login_attempts:<ip>", value = [timestamp, count]
    private final ConcurrentHashMap<String, AttemptWindow> attemptMap = new ConcurrentHashMap<>();

    /**
     * Check if login attempt is allowed for the given IP
     * @param ipAddress the IP address of the request
     * @throws RateLimitExceededException if rate limit is exceeded
     */
    public void checkRateLimit(String ipAddress) {
        String key = ATTEMPTS_KEY_PREFIX + ipAddress;
        Instant now = Instant.now();

        attemptMap.compute(key, (k, existing) -> {
            if (existing == null) {
                // First attempt from this IP
                return new AttemptWindow(now, 1);
            }

            // Check if window has expired
            if (existing.windowStart.plus(WINDOW_MINUTES, ChronoUnit.MINUTES).isBefore(now)) {
                // Window expired, reset
                return new AttemptWindow(now, 1);
            }

            // Window is still active
            if (existing.count >= MAX_ATTEMPTS) {
                long secondsUntilReset = ChronoUnit.SECONDS.between(
                        now,
                        existing.windowStart.plus(WINDOW_MINUTES, ChronoUnit.MINUTES)
                );
                throw new RateLimitExceededException(
                        "Too many login attempts. Please try again in " + secondsUntilReset + " seconds",
                        (int) secondsUntilReset
                );
            }

            // Increment counter
            existing.count++;
            return existing;
        });
    }

    /**
     * Reset rate limit counter for the given IP (called on successful login)
     * @param ipAddress the IP address of the request
     */
    public void resetRateLimit(String ipAddress) {
        String key = ATTEMPTS_KEY_PREFIX + ipAddress;
        attemptMap.remove(key);
    }

    /**
     * Inner class to track attempt window
     */
    private static class AttemptWindow {
        Instant windowStart;
        int count;

        AttemptWindow(Instant windowStart, int count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
