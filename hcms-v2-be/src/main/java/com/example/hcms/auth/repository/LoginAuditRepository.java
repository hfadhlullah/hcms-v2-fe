package com.example.hcms.auth.repository;

import com.example.hcms.auth.domain.LoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Repository for LoginAudit entity operations
 */
@Repository
public interface LoginAuditRepository extends JpaRepository<LoginAudit, Long> {
    /**
     * Find login attempts by email within a time window
     * @param email the email to search for
     * @param afterTime the start of the time window
     * @return list of login audit records
     */
    List<LoginAudit> findByEmailAndAttemptedAtAfter(String email, Instant afterTime);

    /**
     * Find login attempts by IP address within a time window
     * @param ipAddress the IP address to search for
     * @param afterTime the start of the time window
     * @return list of login audit records
     */
    List<LoginAudit> findByIpAddressAndAttemptedAtAfter(String ipAddress, Instant afterTime);

    /**
     * Find failed login attempts by email within a time window
     * @param email the email to search for
     * @param afterTime the start of the time window
     * @return count of failed attempts
     */
    long countByEmailAndSuccessAndAttemptedAtAfter(String email, boolean success, Instant afterTime);
}
