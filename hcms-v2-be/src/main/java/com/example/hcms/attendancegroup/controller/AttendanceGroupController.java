package com.example.hcms.attendancegroup.controller;

import com.example.hcms.attendancegroup.domain.AttendanceGroupStatus;
import com.example.hcms.attendancegroup.dto.AttendanceGroupResponse;
import com.example.hcms.attendancegroup.dto.CreateAttendanceGroupRequest;
import com.example.hcms.attendancegroup.dto.UpdateAttendanceGroupRequest;
import com.example.hcms.attendancegroup.service.AttendanceGroupService;
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

import java.util.Map;

/**
 * REST controller for Attendance Group management
 */
@RestController
@RequestMapping("/api/v1/attendance-groups")
public class AttendanceGroupController {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceGroupController.class);
    private final AttendanceGroupService service;

    public AttendanceGroupController(AttendanceGroupService service) {
        this.service = service;
    }

    /**
     * Get all attendance groups with pagination and filtering
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN', 'EMPLOYEE')")
    public ResponseEntity<Page<AttendanceGroupResponse>> getAllGroups(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AttendanceGroupStatus status,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<AttendanceGroupResponse> groups = service.getAllGroups(search, status, pageable);
        return ResponseEntity.ok(groups);
    }

    /**
     * Get a specific attendance group by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN', 'EMPLOYEE')")
    public ResponseEntity<AttendanceGroupResponse> getGroupById(@PathVariable Long id) {
        AttendanceGroupResponse group = service.toResponse(service.getGroupById(id));
        return ResponseEntity.ok(group);
    }

    /**
     * Create a new attendance group
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN')")
    public ResponseEntity<AttendanceGroupResponse> createGroup(
            @Valid @RequestBody CreateAttendanceGroupRequest request,
            Authentication authentication) {

        Long userId = extractUserId(authentication);
        AttendanceGroupResponse group = service.createGroup(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(group);
    }

    /**
     * Update an existing attendance group
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN')")
    public ResponseEntity<AttendanceGroupResponse> updateGroup(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAttendanceGroupRequest request,
            Authentication authentication) {

        Long userId = extractUserId(authentication);
        AttendanceGroupResponse group = service.updateGroup(id, request, userId);
        return ResponseEntity.ok(group);
    }

    /**
     * Delete an attendance group (soft delete)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('HR_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteGroup(
            @PathVariable Long id,
            Authentication authentication) {

        logger.info("DELETE request for attendance group id: {}", id);
        Long userId = extractUserId(authentication);

        if (userId == null) {
            logger.error("Failed to extract userId from authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        service.deleteGroup(id, userId);
        logger.info("Successfully deleted attendance group id: {}", id);
        return ResponseEntity.ok(Map.of("message", "Successfully deleted attendance group"));
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
