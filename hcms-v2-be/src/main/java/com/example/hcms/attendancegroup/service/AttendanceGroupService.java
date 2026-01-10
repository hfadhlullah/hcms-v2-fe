package com.example.hcms.attendancegroup.service;

import com.example.hcms.attendancegroup.domain.AttendanceGroup;
import com.example.hcms.attendancegroup.domain.AttendanceGroupStatus;
import com.example.hcms.attendancegroup.dto.AttendanceGroupResponse;
import com.example.hcms.attendancegroup.dto.CreateAttendanceGroupRequest;
import com.example.hcms.attendancegroup.dto.UpdateAttendanceGroupRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for AttendanceGroup operations
 */
public interface AttendanceGroupService {

    /**
     * Get all attendance groups with optional search
     */
    Page<AttendanceGroupResponse> getAllGroups(String search, AttendanceGroupStatus status, Pageable pageable);

    /**
     * Get a single group by ID
     */
    AttendanceGroup getGroupById(Long id);

    /**
     * Create a new attendance group
     */
    AttendanceGroupResponse createGroup(CreateAttendanceGroupRequest request, Long userId);

    /**
     * Update an existing attendance group
     */
    AttendanceGroupResponse updateGroup(Long id, UpdateAttendanceGroupRequest request, Long userId);

    /**
     * Delete (soft delete) an attendance group
     */
    void deleteGroup(Long id, Long userId);

    /**
     * Convert entity to response DTO
     */
    AttendanceGroupResponse toResponse(AttendanceGroup group);
}
