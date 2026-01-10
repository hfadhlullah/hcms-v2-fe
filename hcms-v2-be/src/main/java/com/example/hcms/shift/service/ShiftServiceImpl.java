package com.example.hcms.shift.service;

import com.example.hcms.shift.domain.DateType;
import com.example.hcms.shift.domain.Shift;
import com.example.hcms.shift.domain.ShiftStatus;
import com.example.hcms.shift.domain.ShiftType;
import com.example.hcms.shift.dto.CreateShiftRequest;
import com.example.hcms.shift.dto.ShiftResponse;
import com.example.hcms.shift.dto.UpdateShiftRequest;
import com.example.hcms.shift.exception.ShiftNotFoundException;
import com.example.hcms.shift.repository.ShiftRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

/**
 * Service implementation for shift management - Lark-style
 */
@Service
@Transactional
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;

    public ShiftServiceImpl(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Shift getShiftById(Long id) {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new ShiftNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ShiftResponse> getAllShifts(String search, ShiftStatus status, Pageable pageable) {
        Page<Shift> shifts;

        if (search != null && !search.trim().isEmpty()) {
            // Search in name only (code is now optional)
            shifts = shiftRepository.findByStatusAndNameContainingIgnoreCase(
                    ShiftStatus.ACTIVE, search, pageable);
        } else if (status != null) {
            shifts = shiftRepository.findByStatus(status, pageable);
        } else {
            // Default to showing only ACTIVE shifts
            shifts = shiftRepository.findByStatus(ShiftStatus.ACTIVE, pageable);
        }

        return shifts.map(this::toResponse);
    }

    @Override
    public ShiftResponse createShift(CreateShiftRequest request, Long userId) {
        Shift shift = new Shift();

        // Basic info
        shift.setName(request.getName());
        shift.setDescription(request.getDescription());

        // Shift type and date type
        shift.setShiftType(ShiftType.valueOf(request.getShiftType()));
        shift.setDateType(DateType.valueOf(request.getDateType()));

        // Time parameters
        shift.setStartTime(LocalTime.parse(request.getStartTime()));
        shift.setEndTime(LocalTime.parse(request.getEndTime()));
        shift.setIsNextDayEnd(request.getIsNextDayEnd() != null ? request.getIsNextDayEnd() : false);
        shift.setRequireClockIn(request.getRequireClockIn() != null ? request.getRequireClockIn() : true);
        shift.setRequireClockOut(request.getRequireClockOut() != null ? request.getRequireClockOut() : true);

        // Clock-In Rules
        shift.setClockInEarlyMinutes(request.getClockInEarlyMinutes() != null ? request.getClockInEarlyMinutes() : 60);
        shift.setLateThresholdMinutes(
                request.getLateThresholdMinutes() != null ? request.getLateThresholdMinutes() : 0);
        shift.setHalfDayLateThresholdMinutes(
                request.getHalfDayLateThresholdMinutes() != null ? request.getHalfDayLateThresholdMinutes() : 30);

        // Clock-Out Rules
        shift.setClockOutLateMinutes(request.getClockOutLateMinutes() != null ? request.getClockOutLateMinutes() : 480);
        shift.setEarlyOutThresholdMinutes(
                request.getEarlyOutThresholdMinutes() != null ? request.getEarlyOutThresholdMinutes() : 0);
        shift.setHalfDayEarlyThresholdMinutes(
                request.getHalfDayEarlyThresholdMinutes() != null ? request.getHalfDayEarlyThresholdMinutes() : 30);

        // Flextime settings
        shift.setFlexLateHours(request.getFlexLateHours() != null ? request.getFlexLateHours() : 1);
        shift.setFlexLateMinutes(request.getFlexLateMinutes() != null ? request.getFlexLateMinutes() : 0);
        shift.setFlexEarlyHours(request.getFlexEarlyHours() != null ? request.getFlexEarlyHours() : 1);
        shift.setFlexEarlyMinutes(request.getFlexEarlyMinutes() != null ? request.getFlexEarlyMinutes() : 0);

        // Break settings
        shift.setHasBreaks(request.getHasBreaks() != null ? request.getHasBreaks() : false);
        shift.setBreakDurationMinutes(
                request.getBreakDurationMinutes() != null ? request.getBreakDurationMinutes() : 0);

        // Metadata
        shift.setCreatedBy(userId);
        shift.setUpdatedBy(userId);
        shift.setStatus(ShiftStatus.ACTIVE);

        Shift savedShift = shiftRepository.save(shift);
        return toResponse(savedShift);
    }

    @Override
    public ShiftResponse updateShift(Long id, UpdateShiftRequest request, Long userId) {
        Shift shift = getShiftById(id);

        // Basic info
        if (request.getName() != null && !request.getName().isEmpty()) {
            shift.setName(request.getName());
        }
        if (request.getDescription() != null) {
            shift.setDescription(request.getDescription());
        }

        // Shift type and date type
        if (request.getShiftType() != null) {
            shift.setShiftType(ShiftType.valueOf(request.getShiftType()));
        }
        if (request.getDateType() != null) {
            shift.setDateType(DateType.valueOf(request.getDateType()));
        }

        // Time parameters
        if (request.getStartTime() != null && !request.getStartTime().isEmpty()) {
            shift.setStartTime(LocalTime.parse(request.getStartTime()));
        }
        if (request.getEndTime() != null && !request.getEndTime().isEmpty()) {
            shift.setEndTime(LocalTime.parse(request.getEndTime()));
        }
        if (request.getIsNextDayEnd() != null) {
            shift.setIsNextDayEnd(request.getIsNextDayEnd());
        }
        if (request.getRequireClockIn() != null) {
            shift.setRequireClockIn(request.getRequireClockIn());
        }
        if (request.getRequireClockOut() != null) {
            shift.setRequireClockOut(request.getRequireClockOut());
        }

        // Clock-In Rules
        if (request.getClockInEarlyMinutes() != null) {
            shift.setClockInEarlyMinutes(request.getClockInEarlyMinutes());
        }
        if (request.getLateThresholdMinutes() != null) {
            shift.setLateThresholdMinutes(request.getLateThresholdMinutes());
        }
        if (request.getHalfDayLateThresholdMinutes() != null) {
            shift.setHalfDayLateThresholdMinutes(request.getHalfDayLateThresholdMinutes());
        }

        // Clock-Out Rules
        if (request.getClockOutLateMinutes() != null) {
            shift.setClockOutLateMinutes(request.getClockOutLateMinutes());
        }
        if (request.getEarlyOutThresholdMinutes() != null) {
            shift.setEarlyOutThresholdMinutes(request.getEarlyOutThresholdMinutes());
        }
        if (request.getHalfDayEarlyThresholdMinutes() != null) {
            shift.setHalfDayEarlyThresholdMinutes(request.getHalfDayEarlyThresholdMinutes());
        }

        // Flextime settings
        if (request.getFlexLateHours() != null) {
            shift.setFlexLateHours(request.getFlexLateHours());
        }
        if (request.getFlexLateMinutes() != null) {
            shift.setFlexLateMinutes(request.getFlexLateMinutes());
        }
        if (request.getFlexEarlyHours() != null) {
            shift.setFlexEarlyHours(request.getFlexEarlyHours());
        }
        if (request.getFlexEarlyMinutes() != null) {
            shift.setFlexEarlyMinutes(request.getFlexEarlyMinutes());
        }

        // Break settings
        if (request.getHasBreaks() != null) {
            shift.setHasBreaks(request.getHasBreaks());
        }
        if (request.getBreakDurationMinutes() != null) {
            shift.setBreakDurationMinutes(request.getBreakDurationMinutes());
        }

        shift.setUpdatedBy(userId);
        Shift updatedShift = shiftRepository.save(shift);
        return toResponse(updatedShift);
    }

    @Override
    public void deleteShift(Long id, Long userId) {
        Shift shift = getShiftById(id);
        shift.setStatus(ShiftStatus.INACTIVE);
        shift.setUpdatedBy(userId);
        shiftRepository.save(shift);
    }

    @Override
    public ShiftResponse toResponse(Shift shift) {
        ShiftResponse response = new ShiftResponse();
        response.setId(shift.getId());
        response.setCode(shift.getCode());
        response.setName(shift.getName());
        response.setDescription(shift.getDescription());
        response.setShiftType(shift.getShiftType() != null ? shift.getShiftType().toString() : "FIXED_TIME");
        response.setDateType(shift.getDateType() != null ? shift.getDateType().toString() : "WORK_DAYS");
        response.setStartTime(shift.getStartTime() != null ? shift.getStartTime().toString() : null);
        response.setEndTime(shift.getEndTime() != null ? shift.getEndTime().toString() : null);
        response.setIsNextDayEnd(shift.getIsNextDayEnd());
        response.setRequireClockIn(shift.getRequireClockIn());
        response.setRequireClockOut(shift.getRequireClockOut());
        response.setClockInEarlyMinutes(shift.getClockInEarlyMinutes());
        response.setLateThresholdMinutes(shift.getLateThresholdMinutes());
        response.setHalfDayLateThresholdMinutes(shift.getHalfDayLateThresholdMinutes());
        response.setClockOutLateMinutes(shift.getClockOutLateMinutes());
        response.setEarlyOutThresholdMinutes(shift.getEarlyOutThresholdMinutes());
        response.setHalfDayEarlyThresholdMinutes(shift.getHalfDayEarlyThresholdMinutes());
        response.setFlexLateHours(shift.getFlexLateHours());
        response.setFlexLateMinutes(shift.getFlexLateMinutes());
        response.setFlexEarlyHours(shift.getFlexEarlyHours());
        response.setFlexEarlyMinutes(shift.getFlexEarlyMinutes());
        response.setHasBreaks(shift.getHasBreaks());
        response.setBreakDurationMinutes(shift.getBreakDurationMinutes());
        response.setWorkingHoursMinutes(shift.getWorkingHoursMinutes());
        response.setStatus(shift.getStatus().toString());
        response.setCreatedAt(shift.getCreatedAt());
        response.setUpdatedAt(shift.getUpdatedAt());
        return response;
    }
}
