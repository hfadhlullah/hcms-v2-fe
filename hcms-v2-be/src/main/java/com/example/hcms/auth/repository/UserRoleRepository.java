package com.example.hcms.auth.repository;

import com.example.hcms.auth.domain.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for UserRole entity operations
 */
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    // Additional query methods can be added as needed
}
