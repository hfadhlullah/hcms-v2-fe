package com.example.hcms.attendancegroup.repository;

import com.example.hcms.attendancegroup.domain.AttendanceGroup;
import com.example.hcms.attendancegroup.domain.AttendanceGroupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for AttendanceGroup entities
 */
@Repository
public interface AttendanceGroupRepository extends JpaRepository<AttendanceGroup, Long> {

    /**
     * Find all groups by status with pagination
     */
    Page<AttendanceGroup> findByStatus(AttendanceGroupStatus status, Pageable pageable);

    /**
     * Find groups by status and name containing (case-insensitive)
     */
    Page<AttendanceGroup> findByStatusAndNameContainingIgnoreCase(
            AttendanceGroupStatus status,
            String name,
            Pageable pageable);

    /**
     * Find a group by ID and status
     */
    Optional<AttendanceGroup> findByIdAndStatus(Long id, AttendanceGroupStatus status);

    /**
     * Check if a group exists by name (for uniqueness validation)
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Check if a group exists by name excluding a specific ID (for update
     * validation)
     */
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
