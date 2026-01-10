package com.example.hcms.auth.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Audit log for login attempts (successful and failed)
 */
@Entity
@Table(name = "login_audit", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_attempted_at", columnList = "attempted_at")
})
public class LoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private Boolean success;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(length = 255)
    private String reason;

    @Column(nullable = false, updatable = false)
    private Instant attemptedAt;

    @PrePersist
    protected void onCreate() {
        attemptedAt = Instant.now();
    }

    // Constructors
    public LoginAudit() {}

    public LoginAudit(String email, Boolean success, String ipAddress, String userAgent, String reason) {
        this.email = email;
        this.success = success;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.reason = reason;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Instant getAttemptedAt() {
        return attemptedAt;
    }

    public void setAttemptedAt(Instant attemptedAt) {
        this.attemptedAt = attemptedAt;
    }

    @Override
    public String toString() {
        return "LoginAudit{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", success=" + success +
                ", ipAddress='" + ipAddress + '\'' +
                ", attemptedAt=" + attemptedAt +
                '}';
    }
}
