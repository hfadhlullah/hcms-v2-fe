package com.example.hcms.auth.service;

import com.example.hcms.auth.domain.LoginAudit;
import com.example.hcms.auth.repository.LoginAuditRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for logging login attempts to audit trail
 */
@Service
@Transactional
public class AuthAuditService {

    private final LoginAuditRepository loginAuditRepository;

    public AuthAuditService(LoginAuditRepository loginAuditRepository) {
        this.loginAuditRepository = loginAuditRepository;
    }

    /**
     * Log a login attempt (successful or failed)
     * @param email the email of the login attempt
     * @param success whether the login was successful
     * @param ipAddress the IP address of the attempt
     * @param userAgent the user agent of the attempt
     * @param reason the reason if failed (e.g., "INVALID_PASSWORD", "USER_NOT_FOUND")
     * @param userId the user ID if successful, null otherwise
     */
    public void logLoginAttempt(String email, Boolean success, String ipAddress, String userAgent, String reason, Long userId) {
        LoginAudit audit = new LoginAudit(email, success, ipAddress, userAgent, reason);
        if (userId != null) {
            audit.setUserId(userId);
        }
        loginAuditRepository.save(audit);
    }

    /**
     * Log a successful login attempt
     * @param email the email of the user
     * @param userId the user ID
     * @param ipAddress the IP address
     * @param userAgent the user agent
     */
    public void logSuccessfulLogin(String email, Long userId, String ipAddress, String userAgent) {
        logLoginAttempt(email, true, ipAddress, userAgent, null, userId);
    }

    /**
     * Log a failed login attempt
     * @param email the email of the attempted user
     * @param ipAddress the IP address
     * @param userAgent the user agent
     * @param reason the reason for failure
     */
    public void logFailedLogin(String email, String ipAddress, String userAgent, String reason) {
        logLoginAttempt(email, false, ipAddress, userAgent, reason, null);
    }
}
