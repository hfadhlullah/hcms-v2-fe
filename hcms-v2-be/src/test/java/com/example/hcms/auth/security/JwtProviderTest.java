package com.example.hcms.auth.security;

import com.example.hcms.auth.exception.TokenException;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for JwtProvider
 */
public class JwtProviderTest {

    private JwtProvider jwtProvider;
    private static final String TEST_SECRET = "TestSecretKeyForJWTTokenGenerationAndValidation1234567890";

    @BeforeEach
    public void setUp() {
        jwtProvider = new JwtProvider();
        // Set test secret via reflection
        ReflectionTestUtils.setField(jwtProvider, "jwtSecret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtProvider, "expirationHours", 8L);
    }

    @Test
    public void testGenerateToken() {
        // Arrange
        Long userId = 42L;
        Set<String> roles = Set.of("EMPLOYEE", "MANAGER");

        // Act
        String token = jwtProvider.generateToken(userId, roles);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.contains("."));  // JWT has 3 parts separated by dots
    }

    @Test
    public void testValidateTokenAndGetClaims() {
        // Arrange
        Long userId = 42L;
        Set<String> roles = Set.of("EMPLOYEE");
        String token = jwtProvider.generateToken(userId, roles);

        // Act
        Claims claims = jwtProvider.validateTokenAndGetClaims(token);

        // Assert
        assertNotNull(claims);
        assertEquals("42", claims.getSubject());
        assertEquals(userId, claims.get("userId", Long.class));
    }

    @Test
    public void testValidateInvalidToken() {
        // Arrange
        String invalidToken = "invalid.jwt.token";

        // Act & Assert
        assertThrows(TokenException.class, () -> {
            jwtProvider.validateTokenAndGetClaims(invalidToken);
        });
    }

    @Test
    public void testGetUserIdFromToken() {
        // Arrange
        Long userId = 99L;
        Set<String> roles = Set.of("ADMIN");
        String token = jwtProvider.generateToken(userId, roles);

        // Act
        Long extractedUserId = jwtProvider.getUserIdFromToken(token);

        // Assert
        assertEquals(userId, extractedUserId);
    }

    @Test
    public void testGetRolesFromToken() {
        // Arrange
        Long userId = 42L;
        Set<String> roles = Set.of("EMPLOYEE", "MANAGER");
        String token = jwtProvider.generateToken(userId, roles);

        // Act
        Set<String> extractedRoles = jwtProvider.getRolesFromToken(token);

        // Assert
        assertNotNull(extractedRoles);
        assertEquals(roles, extractedRoles);
    }

    @Test
    public void testTokenExpiration() {
        // Arrange - create token and wait to validate it doesn't expire too quickly
        Long userId = 42L;
        Set<String> roles = Set.of("EMPLOYEE");
        String token = jwtProvider.generateToken(userId, roles);
        Instant expiresAt = jwtProvider.getTokenExpirationTime();

        // Act - validate immediately
        Claims claims = jwtProvider.validateTokenAndGetClaims(token);

        // Assert - token should be valid
        assertNotNull(claims);
        // Expiration should be approximately 8 hours from now
        long hoursUntilExpiry = ChronoUnit.HOURS.between(Instant.now(), expiresAt);
        assertTrue(hoursUntilExpiry >= 7 && hoursUntilExpiry <= 8,
                "Token should expire in approximately 8 hours");
    }
}
