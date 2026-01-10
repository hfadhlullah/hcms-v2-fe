package com.example.hcms.shift.repository;

import com.example.hcms.shift.domain.Shift;
import com.example.hcms.shift.domain.ShiftStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Shift entity
 */
@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    Optional<Shift> findByCode(String code);

    Page<Shift> findByStatus(ShiftStatus status, Pageable pageable);

    Page<Shift> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(String nameSearch, String codeSearch,
            Pageable pageable);

    Page<Shift> findByStatusAndNameContainingIgnoreCase(ShiftStatus status, String nameSearch, Pageable pageable);

    Page<Shift> findByStatusAndNameContainingIgnoreCaseOrStatusAndCodeContainingIgnoreCase(
            ShiftStatus status1, String nameSearch,
            ShiftStatus status2, String codeSearch,
            Pageable pageable);
}
