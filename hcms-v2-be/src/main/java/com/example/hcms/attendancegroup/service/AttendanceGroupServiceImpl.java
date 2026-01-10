package com.example.hcms.attendancegroup.service;

import com.example.hcms.attendancegroup.domain.*;
import com.example.hcms.attendancegroup.dto.*;
import com.example.hcms.attendancegroup.repository.AttendanceGroupRepository;
import com.example.hcms.shift.domain.Shift;
import com.example.hcms.shift.repository.ShiftRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

/**
 * Implementation of AttendanceGroupService
 */
@Service
@Transactional
public class AttendanceGroupServiceImpl implements AttendanceGroupService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceGroupServiceImpl.class);

    private final AttendanceGroupRepository repository;
    private final ShiftRepository shiftRepository;
    private final ObjectMapper objectMapper;

    public AttendanceGroupServiceImpl(
            AttendanceGroupRepository repository,
            ShiftRepository shiftRepository,
            ObjectMapper objectMapper) {
        this.repository = repository;
        this.shiftRepository = shiftRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceGroupResponse> getAllGroups(String search, AttendanceGroupStatus status, Pageable pageable) {
        AttendanceGroupStatus effectiveStatus = status != null ? status : AttendanceGroupStatus.ACTIVE;

        Page<AttendanceGroup> groups;
        if (search != null && !search.trim().isEmpty()) {
            groups = repository.findByStatusAndNameContainingIgnoreCase(effectiveStatus, search.trim(), pageable);
        } else {
            groups = repository.findByStatus(effectiveStatus, pageable);
        }

        return groups.map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceGroup getGroupById(Long id) {
        return repository.findByIdAndStatus(id, AttendanceGroupStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("Attendance group not found: " + id));
    }

    @Override
    public AttendanceGroupResponse createGroup(CreateAttendanceGroupRequest request, Long userId) {
        logger.info("Creating attendance group: {} by user: {}", request.getName(), userId);

        // Check for duplicate name
        if (repository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Attendance group with name '" + request.getName() + "' already exists");
        }

        AttendanceGroup group = new AttendanceGroup();
        mapRequestToEntity(request, group);

        // Set owner if not specified
        if (group.getOwnerId() == null) {
            group.setOwnerId(userId);
        }

        // Set default shift if specified
        if (request.getDefaultShiftId() != null) {
            Shift shift = shiftRepository.findById(request.getDefaultShiftId())
                    .orElseThrow(() -> new RuntimeException("Shift not found: " + request.getDefaultShiftId()));
            group.setDefaultShift(shift);
        }

        AttendanceGroup saved = repository.save(group);
        logger.info("Created attendance group with ID: {}", saved.getId());

        return toResponse(saved);
    }

    @Override
    public AttendanceGroupResponse updateGroup(Long id, UpdateAttendanceGroupRequest request, Long userId) {
        logger.info("Updating attendance group: {} by user: {}", id, userId);

        AttendanceGroup group = getGroupById(id);

        // Check for duplicate name if changed
        if (!group.getName().equalsIgnoreCase(request.getName())
                && repository.existsByNameIgnoreCaseAndIdNot(request.getName(), id)) {
            throw new RuntimeException("Attendance group with name '" + request.getName() + "' already exists");
        }

        mapRequestToEntity(request, group);

        // Update default shift if specified
        if (request.getDefaultShiftId() != null) {
            Shift shift = shiftRepository.findById(request.getDefaultShiftId())
                    .orElseThrow(() -> new RuntimeException("Shift not found: " + request.getDefaultShiftId()));
            group.setDefaultShift(shift);
        } else {
            group.setDefaultShift(null);
        }

        AttendanceGroup saved = repository.save(group);
        logger.info("Updated attendance group: {}", saved.getId());

        return toResponse(saved);
    }

    @Override
    public void deleteGroup(Long id, Long userId) {
        logger.info("Deleting attendance group: {} by user: {}", id, userId);

        AttendanceGroup group = getGroupById(id);
        group.setStatus(AttendanceGroupStatus.INACTIVE);
        repository.save(group);

        logger.info("Soft deleted attendance group: {}", id);
    }

    @Override
    public AttendanceGroupResponse toResponse(AttendanceGroup group) {
        AttendanceGroupResponse response = new AttendanceGroupResponse();

        response.setId(group.getId());
        response.setName(group.getName());
        response.setOwnerId(group.getOwnerId());
        response.setSubOwnerIds(parseJsonList(group.getSubOwnerIds(), Long.class));
        response.setTimezone(group.getTimezone());
        response.setRelocationSync(group.getRelocationSync());

        // Member tracking
        response.setMemberTrackingRequired(group.getMemberTrackingRequired());
        response.setMemberTrackingRequiredConditions(group.getMemberTrackingRequiredConditions());
        response.setMemberTrackingOptional(group.getMemberTrackingOptional());
        response.setMemberTrackingOptionalConditions(group.getMemberTrackingOptionalConditions());

        // Shift settings
        response.setShiftType(group.getShiftType());
        if (group.getDefaultShift() != null) {
            response.setDefaultShiftId(group.getDefaultShift().getId());
            response.setDefaultShiftName(group.getDefaultShift().getName());
            response.setDefaultShiftTime(
                    group.getDefaultShift().getStartTime() + " ~ " + group.getDefaultShift().getEndTime());
        }

        // Weekly schedule
        response.setMondayShiftId(group.getMondayShiftId());
        response.setTuesdayShiftId(group.getTuesdayShiftId());
        response.setWednesdayShiftId(group.getWednesdayShiftId());
        response.setThursdayShiftId(group.getThursdayShiftId());
        response.setFridayShiftId(group.getFridayShiftId());
        response.setSaturdayShiftId(group.getSaturdayShiftId());
        response.setSundayShiftId(group.getSundayShiftId());

        // Schedule settings
        response.setUsePublicHolidays(group.getUsePublicHolidays());
        response.setSpecialDays(parseJsonList(group.getSpecialDays(), String.class));

        // Attendance settings
        response.setRequirePhoto(group.getRequirePhoto());
        response.setAllowOffsite(group.getAllowOffsite());
        response.setOutOfOfficePolicy(group.getOutOfOfficePolicy());
        response.setBusinessTripPolicy(group.getBusinessTripPolicy());
        response.setPartialLeavePolicy(group.getPartialLeavePolicy());
        response.setRecordOvertime(group.getRecordOvertime());
        response.setNonWorkingDayApproval(group.getNonWorkingDayApproval());
        response.setNonWorkingDayResetTime(
                group.getNonWorkingDayResetTime() != null ? group.getNonWorkingDayResetTime().toString() : null);
        response.setAllowCorrections(group.getAllowCorrections());
        response.setCorrectionTypes(parseJsonList(group.getCorrectionTypes(), String.class));

        // Metadata
        response.setStatus(group.getStatus());
        response.setCreatedAt(group.getCreatedAt());
        response.setUpdatedAt(group.getUpdatedAt());
        response.setMemberCount(0); // TODO: Calculate when members feature is implemented

        return response;
    }

    private void mapRequestToEntity(CreateAttendanceGroupRequest request, AttendanceGroup group) {
        group.setName(request.getName());

        if (request.getOwnerId() != null) {
            group.setOwnerId(request.getOwnerId());
        }
        if (request.getSubOwnerIds() != null) {
            group.setSubOwnerIds(toJson(request.getSubOwnerIds()));
        }
        if (request.getTimezone() != null) {
            group.setTimezone(request.getTimezone());
        }
        if (request.getRelocationSync() != null) {
            group.setRelocationSync(request.getRelocationSync());
        }

        // Member tracking
        if (request.getMemberTrackingRequired() != null) {
            group.setMemberTrackingRequired(request.getMemberTrackingRequired());
        }
        if (request.getMemberTrackingRequiredConditions() != null) {
            group.setMemberTrackingRequiredConditions(request.getMemberTrackingRequiredConditions());
        }
        if (request.getMemberTrackingOptional() != null) {
            group.setMemberTrackingOptional(request.getMemberTrackingOptional());
        }
        if (request.getMemberTrackingOptionalConditions() != null) {
            group.setMemberTrackingOptionalConditions(request.getMemberTrackingOptionalConditions());
        }

        // Shift settings
        if (request.getShiftType() != null) {
            group.setShiftType(request.getShiftType());
        }

        // Weekly schedule
        group.setMondayShiftId(request.getMondayShiftId());
        group.setTuesdayShiftId(request.getTuesdayShiftId());
        group.setWednesdayShiftId(request.getWednesdayShiftId());
        group.setThursdayShiftId(request.getThursdayShiftId());
        group.setFridayShiftId(request.getFridayShiftId());
        group.setSaturdayShiftId(request.getSaturdayShiftId());
        group.setSundayShiftId(request.getSundayShiftId());

        // Schedule settings
        if (request.getUsePublicHolidays() != null) {
            group.setUsePublicHolidays(request.getUsePublicHolidays());
        }
        if (request.getSpecialDays() != null) {
            group.setSpecialDays(toJson(request.getSpecialDays()));
        }

        // Attendance settings
        if (request.getRequirePhoto() != null) {
            group.setRequirePhoto(request.getRequirePhoto());
        }
        if (request.getAllowOffsite() != null) {
            group.setAllowOffsite(request.getAllowOffsite());
        }
        if (request.getOutOfOfficePolicy() != null) {
            group.setOutOfOfficePolicy(request.getOutOfOfficePolicy());
        }
        if (request.getBusinessTripPolicy() != null) {
            group.setBusinessTripPolicy(request.getBusinessTripPolicy());
        }
        if (request.getPartialLeavePolicy() != null) {
            group.setPartialLeavePolicy(request.getPartialLeavePolicy());
        }
        if (request.getRecordOvertime() != null) {
            group.setRecordOvertime(request.getRecordOvertime());
        }
        if (request.getNonWorkingDayApproval() != null) {
            group.setNonWorkingDayApproval(request.getNonWorkingDayApproval());
        }
        if (request.getNonWorkingDayResetTime() != null) {
            group.setNonWorkingDayResetTime(LocalTime.parse(request.getNonWorkingDayResetTime()));
        }
        if (request.getAllowCorrections() != null) {
            group.setAllowCorrections(request.getAllowCorrections());
        }
        if (request.getCorrectionTypes() != null) {
            group.setCorrectionTypes(toJson(request.getCorrectionTypes()));
        }
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            logger.error("Failed to serialize to JSON", e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private <T> List<T> parseJsonList(String json, Class<T> elementType) {
        if (json == null || json.isEmpty()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<T>>() {
            });
        } catch (JsonProcessingException e) {
            logger.error("Failed to parse JSON list", e);
            return Collections.emptyList();
        }
    }
}
