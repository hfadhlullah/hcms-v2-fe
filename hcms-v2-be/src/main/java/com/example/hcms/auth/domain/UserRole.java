package com.example.hcms.auth.domain;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * UserRole entity representing a user's role assignment.
 * Maps users to roles: EMPLOYEE, MANAGER, HR, ADMIN
 */
@Entity
@Table(name = "user_role", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "role"})
}, indexes = {
    @Index(name = "idx_user_role", columnList = "user_id")
})
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false, updatable = false)
    private Instant assignedAt;

    @PrePersist
    protected void onCreate() {
        assignedAt = Instant.now();
    }

    // Constructors
    public UserRole() {}

    public UserRole(User user, Role role) {
        this.user = user;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Instant getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(Instant assignedAt) {
        this.assignedAt = assignedAt;
    }

    @Override
    public String toString() {
        return "UserRole{" +
                "id=" + id +
                ", role=" + role +
                ", assignedAt=" + assignedAt +
                '}';
    }

    /**
     * Role enum: EMPLOYEE, MANAGER, HR, ADMIN
     */
    public enum Role {
        EMPLOYEE,
        MANAGER,
        HR,
        ADMIN
    }
}
