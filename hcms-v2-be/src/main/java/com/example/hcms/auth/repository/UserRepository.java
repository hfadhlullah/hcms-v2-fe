package com.example.hcms.auth.repository;

import com.example.hcms.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity operations
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Find user by email
     * @param email the user's email
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by username
     * @param username the user's username
     * @return Optional containing user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Check if user exists by email
     * @param email the email to check
     * @return true if user exists
     */
    boolean existsByEmail(String email);
}
