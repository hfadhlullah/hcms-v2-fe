package com.example.hcms.auth.security;

import com.example.hcms.auth.exception.TokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * JWT token provider for generating and validating JWT tokens
 */
@Component
public class JwtProvider {

    @Value("${app.security.jwt.secret:SuperSecretKeyForJWTTokenGenerationAndValidation12345678901234567890}")
    private String jwtSecret;

    @Value("${app.security.jwt.expiration-hours:8}")
    private long expirationHours;

    @Value("${app.security.jwt.remember-me-days:30}")
    private long rememberMeDays;

    private static final String ROLES_CLAIM = "roles";
    private static final String USER_ID_CLAIM = "userId";

    /**
     * Generate a JWT token for the given user ID and roles
     * @param userId the user ID
     * @param roles the user's roles
     * @return signed JWT token string
     */
    public String generateToken(Long userId, Set<String> roles) {
        return generateToken(userId, roles, false);
    }

    /**
     * Generate a JWT token with optional remember me expiration
     * @param userId the user ID
     * @param roles the user's roles
     * @param rememberMe whether to use extended expiration
     * @return signed JWT token string
     */
    public String generateToken(Long userId, Set<String> roles, boolean rememberMe) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Instant now = Instant.now();
        Instant expiryTime;

        if (rememberMe) {
            expiryTime = now.plus(rememberMeDays, ChronoUnit.DAYS);
        } else {
            expiryTime = now.plus(expirationHours, ChronoUnit.HOURS);
        }

        return Jwts.builder()
                .subject(userId.toString())
                .claim(USER_ID_CLAIM, userId)
                .claim(ROLES_CLAIM, roles)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiryTime))
                .signWith(key)
                .compact();
    }

    /**
     * Validate and extract claims from a JWT token
     * @param token the JWT token
     * @return Claims object containing token data
     * @throws TokenException if token is invalid or expired
     */
    public Claims validateTokenAndGetClaims(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (io.jsonwebtoken.security.SecurityException | io.jsonwebtoken.MalformedJwtException e) {
            throw new TokenException("Invalid JWT signature or malformed token", e);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            throw new TokenException("JWT token has expired", e);
        } catch (io.jsonwebtoken.UnsupportedJwtException e) {
            throw new TokenException("Unsupported JWT token", e);
        } catch (IllegalArgumentException e) {
            throw new TokenException("JWT claims string is empty", e);
        }
    }

    /**
     * Extract user ID from token
     * @param token the JWT token
     * @return user ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = validateTokenAndGetClaims(token);
        return claims.get(USER_ID_CLAIM, Long.class);
    }

    /**
     * Extract roles from token
     * @param token the JWT token
     * @return set of roles
     */
    public Set<String> getRolesFromToken(String token) {
        Claims claims = validateTokenAndGetClaims(token);
        Object rolesObj = claims.get(ROLES_CLAIM);
        
        if (rolesObj instanceof Collection<?>) {
            return ((Collection<?>) rolesObj).stream()
                    .map(Object::toString)
                    .collect(Collectors.toSet());
        } else if (rolesObj instanceof String) {
            return Set.of((String) rolesObj);
        } else {
            return Collections.emptySet();
        }
    }

    /**
     * Get the expiration time for generated tokens (standard expiration)
     * @return expiration instant
     */
    public Instant getTokenExpirationTime() {
        return getTokenExpirationTime(false);
    }

    /**
     * Get the expiration time for generated tokens
     * @param rememberMe whether to use remember me expiration
     * @return expiration instant
     */
    public Instant getTokenExpirationTime(boolean rememberMe) {
        if (rememberMe) {
            return Instant.now().plus(rememberMeDays, ChronoUnit.DAYS);
        } else {
            return Instant.now().plus(expirationHours, ChronoUnit.HOURS);
        }
    }
}
