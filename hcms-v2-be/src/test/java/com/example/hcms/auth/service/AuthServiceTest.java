package com.example.hcms.auth.service;

import com.example.hcms.auth.domain.User;
import com.example.hcms.auth.domain.UserRole;
import com.example.hcms.auth.dto.LoginRequest;
import com.example.hcms.auth.dto.LoginResponse;
import com.example.hcms.auth.exception.InvalidCredentialsException;
import com.example.hcms.auth.repository.UserRepository;
import com.example.hcms.auth.security.JwtProvider;
import com.example.hcms.auth.security.LoginRateLimiter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @Mock
    private LoginRateLimiter rateLimiter;

    @Mock
    private AuthAuditService auditService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private LoginRequest loginRequest;

    @BeforeEach
    public void setUp() {
        // Setup test user
        testUser = new User("alice@company.com", "alice", "$2a$10$hashedpassword");
        testUser.setId(1L);
        testUser.setFirstName("Alice");
        testUser.setLastName("Smith");
        testUser.setStatus(User.UserStatus.ACTIVE);

        // Add role
        Set<UserRole> roles = new HashSet<>();
        UserRole empRole = new UserRole(testUser, UserRole.Role.EMPLOYEE);
        empRole.setId(1L);
        roles.add(empRole);
        testUser.setRoles(roles);

        // Setup login request
        loginRequest = new LoginRequest("alice@company.com", "password123");
    }

    @Test
    public void testLoginSuccess() {
        // Arrange
        String ipAddress = "192.168.1.100";
        String userAgent = "Mozilla/5.0";
        String mockToken = "mock.jwt.token";

        when(userRepository.findByEmail("alice@company.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPasswordHash())).thenReturn(true);
        when(jwtProvider.generateToken(1L, Set.of("EMPLOYEE"))).thenReturn(mockToken);

        // Act
        LoginResponse response = authService.login(loginRequest, ipAddress, userAgent);

        // Assert
        assertNotNull(response);
        assertEquals(mockToken, response.getToken());
        assertEquals(testUser.getId(), response.getUser().getId());
        assertEquals("alice@company.com", response.getUser().getEmail());
        assertTrue(response.getUser().getRoles().contains("EMPLOYEE"));

        // Verify audit logging
        verify(auditService).logSuccessfulLogin("alice@company.com", 1L, ipAddress, userAgent);
        verify(rateLimiter).resetRateLimit(ipAddress);
    }

    @Test
    public void testLoginFailureUserNotFound() {
        // Arrange
        String ipAddress = "192.168.1.100";
        String userAgent = "Mozilla/5.0";

        when(userRepository.findByEmail("unknown@company.com")).thenReturn(Optional.empty());

        LoginRequest unknownRequest = new LoginRequest("unknown@company.com", "password123");

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(unknownRequest, ipAddress, userAgent);
        });

        // Verify audit logging
        verify(auditService).logFailedLogin("unknown@company.com", ipAddress, userAgent, "USER_NOT_FOUND");
    }

    @Test
    public void testLoginFailureInvalidPassword() {
        // Arrange
        String ipAddress = "192.168.1.100";
        String userAgent = "Mozilla/5.0";

        when(userRepository.findByEmail("alice@company.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongpassword", testUser.getPasswordHash())).thenReturn(false);

        LoginRequest wrongPassRequest = new LoginRequest("alice@company.com", "wrongpassword");

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(wrongPassRequest, ipAddress, userAgent);
        });

        // Verify audit logging
        verify(auditService).logFailedLogin("alice@company.com", ipAddress, userAgent, "INVALID_PASSWORD");
    }

    @Test
    public void testLoginFailureUserInactive() {
        // Arrange
        testUser.setStatus(User.UserStatus.INACTIVE);
        String ipAddress = "192.168.1.100";
        String userAgent = "Mozilla/5.0";

        when(userRepository.findByEmail("alice@company.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPasswordHash())).thenReturn(true);

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(loginRequest, ipAddress, userAgent);
        });

        // Verify audit logging
        verify(auditService).logFailedLogin("alice@company.com", ipAddress, userAgent, "USER_INACTIVE");
    }

    @Test
    public void testLoginEmailNormalization() {
        // Arrange - test case insensitivity
        String ipAddress = "192.168.1.100";
        String userAgent = "Mozilla/5.0";
        String mockToken = "mock.jwt.token";

        LoginRequest mixedCaseRequest = new LoginRequest("ALICE@COMPANY.COM", "password123");

        when(userRepository.findByEmail("alice@company.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPasswordHash())).thenReturn(true);
        when(jwtProvider.generateToken(1L, Set.of("EMPLOYEE"))).thenReturn(mockToken);

        // Act
        LoginResponse response = authService.login(mixedCaseRequest, ipAddress, userAgent);

        // Assert
        assertNotNull(response);
        verify(userRepository).findByEmail("alice@company.com");
    }
}
