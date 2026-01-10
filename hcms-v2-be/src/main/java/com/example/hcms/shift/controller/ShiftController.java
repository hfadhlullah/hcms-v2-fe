package com.example.hcms.shift.controller;

import com.example.hcms.shift.domain.ShiftStatus;
import com.example.hcms.shift.dto.CreateShiftRequest;
import com.example.hcms.shift.dto.ShiftResponse;
import com.example.hcms.shift.dto.UpdateShiftRequest;
import com.example.hcms.shift.service.ShiftService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for shift management
 */
@RestController
@RequestMapping("/api/v1/shifts")
public class ShiftController {

    private static final Logger logger = LoggerFactory.getLogger(ShiftController.class);
    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    /**
     * Get all shifts with pagination and filtering
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN', 'EMPLOYEE')")
    public ResponseEntity<Page<ShiftResponse>> getAllShifts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ShiftStatus status,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<ShiftResponse> shifts = shiftService.getAllShifts(search, status, pageable);
        return ResponseEntity.ok(shifts);
    }

    /**
     * Get a specific shift by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ShiftResponse> getShiftById(@PathVariable Long id) {
        ShiftResponse shift = shiftService.toResponse(shiftService.getShiftById(id));
        return ResponseEntity.ok(shift);
    }

    /**
     * Create a new shift
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN')")
    public ResponseEntity<ShiftResponse> createShift(
            @Valid @RequestBody CreateShiftRequest request,
            Authentication authentication) {

        Long userId = extractUserId(authentication);
        ShiftResponse shift = shiftService.createShift(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(shift);
    }

    /**
     * Update an existing shift
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN')")
    public ResponseEntity<ShiftResponse> updateShift(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShiftRequest request,
            Authentication authentication) {

        Long userId = extractUserId(authentication);
        ShiftResponse shift = shiftService.updateShift(id, request, userId);
        return ResponseEntity.ok(shift);
    }

    /**
     * Delete a shift (soft delete - sets status to INACTIVE)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN')")
    public ResponseEntity<java.util.Map<String, String>> deleteShift(
            @PathVariable Long id,
            Authentication authentication) {

        logger.info("DELETE request for shift id: {}", id);
        Long userId = extractUserId(authentication);
        logger.info("Extracted userId from authentication: {}", userId);

        if (userId == null) {
            logger.error("Failed to extract userId from authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        shiftService.deleteShift(id, userId);
        logger.info("Successfully deleted shift id: {}", id);
        return ResponseEntity.ok(java.util.Map.of("message", "Successfully deleted shift"));
    }

    /**
     * Helper method to extract user ID from authentication
     */
    private Long extractUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof Long) {
            return (Long) authentication.getPrincipal();
        }
        return null;
    }
}
