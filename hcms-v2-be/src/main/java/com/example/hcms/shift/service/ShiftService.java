package com.example.hcms.shift.service;

import com.example.hcms.shift.domain.Shift;
import com.example.hcms.shift.domain.ShiftStatus;
import com.example.hcms.shift.dto.CreateShiftRequest;
import com.example.hcms.shift.dto.ShiftResponse;
import com.example.hcms.shift.dto.UpdateShiftRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for shift management
 */
public interface ShiftService {
    /**
     * Get a shift by ID
     */
    Shift getShiftById(Long id);

    /**
     * Get all shifts with optional filtering
     */
    Page<ShiftResponse> getAllShifts(String search, ShiftStatus status, Pageable pageable);

    /**
     * Create a new shift
     */
    ShiftResponse createShift(CreateShiftRequest request, Long userId);

    /**
     * Update an existing shift
     */
    ShiftResponse updateShift(Long id, UpdateShiftRequest request, Long userId);

    /**
     * Delete (soft delete) a shift
     */
    void deleteShift(Long id, Long userId);

    /**
     * Convert shift entity to response DTO
     */
    ShiftResponse toResponse(Shift shift);
}
