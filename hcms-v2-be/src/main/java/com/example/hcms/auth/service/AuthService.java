package com.example.hcms.auth.service;

import com.example.hcms.auth.domain.User;
import com.example.hcms.auth.dto.LoginRequest;
import com.example.hcms.auth.dto.LoginResponse;
import com.example.hcms.auth.dto.UserResponse;
import com.example.hcms.auth.exception.InvalidCredentialsException;
import com.example.hcms.auth.repository.UserRepository;
import com.example.hcms.auth.security.JwtProvider;
import com.example.hcms.auth.security.LoginRateLimiter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for handling authentication logic
 */
@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final LoginRateLimiter rateLimiter;
    private final AuthAuditService auditService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtProvider jwtProvider,
            LoginRateLimiter rateLimiter,
            AuthAuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.rateLimiter = rateLimiter;
        this.auditService = auditService;
    }

    /**
     * Authenticate user and return login response with JWT token
     * @param request the login request containing email, password, and rememberMe flag
     * @param ipAddress the IP address of the request
     * @param userAgent the user agent of the request
     * @return LoginResponse with token and user info
     * @throws InvalidCredentialsException if credentials are invalid
     */
    public LoginResponse login(LoginRequest request, String ipAddress, String userAgent) {
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();
        boolean rememberMe = request.getRememberMe();

        // Check rate limit first
        rateLimiter.checkRateLimit(ipAddress);

        // Find user by email
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            auditService.logFailedLogin(email, ipAddress, userAgent, "USER_NOT_FOUND");
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            auditService.logFailedLogin(email, ipAddress, userAgent, "INVALID_PASSWORD");
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        // Check user status
        if (!user.getStatus().equals(User.UserStatus.ACTIVE)) {
            auditService.logFailedLogin(email, ipAddress, userAgent, "USER_INACTIVE");
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        // Extract roles
        Set<String> roles = user.getRoles().stream()
                .map(ur -> ur.getRole().name())
                .collect(Collectors.toSet());

        // Generate JWT token with optional remember me extension
        String token = jwtProvider.generateToken(user.getId(), roles, rememberMe);
        Instant expiresAt = jwtProvider.getTokenExpirationTime(rememberMe);

        // Create response
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                roles
        );

        LoginResponse response = new LoginResponse(
                token,
                userResponse,
                expiresAt.toString()
        );

        // Log successful login
        auditService.logSuccessfulLogin(email, user.getId(), ipAddress, userAgent);

        // Reset rate limit on successful login
        rateLimiter.resetRateLimit(ipAddress);

        return response;
    }
}
