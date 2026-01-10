package com.example.hcms.shift.dto;

import java.time.Instant;

/**
 * DTO for shift response data - Lark-style
 */
public class ShiftResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String shiftType;
    private String dateType;
    private String startTime;
    private String endTime;
    private Boolean isNextDayEnd;
    private Boolean requireClockIn;
    private Boolean requireClockOut;

    // Clock-In Rules
    private Integer clockInEarlyMinutes;
    private Integer lateThresholdMinutes;
    private Integer halfDayLateThresholdMinutes;

    // Clock-Out Rules
    private Integer clockOutLateMinutes;
    private Integer earlyOutThresholdMinutes;
    private Integer halfDayEarlyThresholdMinutes;

    // Flextime
    private Integer flexLateHours;
    private Integer flexLateMinutes;
    private Integer flexEarlyHours;
    private Integer flexEarlyMinutes;

    // Breaks
    private Boolean hasBreaks;
    private Integer breakDurationMinutes;

    private Integer workingHoursMinutes;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    public ShiftResponse() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getShiftType() {
        return shiftType;
    }

    public void setShiftType(String shiftType) {
        this.shiftType = shiftType;
    }

    public String getDateType() {
        return dateType;
    }

    public void setDateType(String dateType) {
        this.dateType = dateType;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public Boolean getIsNextDayEnd() {
        return isNextDayEnd;
    }

    public void setIsNextDayEnd(Boolean isNextDayEnd) {
        this.isNextDayEnd = isNextDayEnd;
    }

    public Boolean getRequireClockIn() {
        return requireClockIn;
    }

    public void setRequireClockIn(Boolean requireClockIn) {
        this.requireClockIn = requireClockIn;
    }

    public Boolean getRequireClockOut() {
        return requireClockOut;
    }

    public void setRequireClockOut(Boolean requireClockOut) {
        this.requireClockOut = requireClockOut;
    }

    public Integer getClockInEarlyMinutes() {
        return clockInEarlyMinutes;
    }

    public void setClockInEarlyMinutes(Integer clockInEarlyMinutes) {
        this.clockInEarlyMinutes = clockInEarlyMinutes;
    }

    public Integer getLateThresholdMinutes() {
        return lateThresholdMinutes;
    }

    public void setLateThresholdMinutes(Integer lateThresholdMinutes) {
        this.lateThresholdMinutes = lateThresholdMinutes;
    }

    public Integer getHalfDayLateThresholdMinutes() {
        return halfDayLateThresholdMinutes;
    }

    public void setHalfDayLateThresholdMinutes(Integer halfDayLateThresholdMinutes) {
        this.halfDayLateThresholdMinutes = halfDayLateThresholdMinutes;
    }

    public Integer getClockOutLateMinutes() {
        return clockOutLateMinutes;
    }

    public void setClockOutLateMinutes(Integer clockOutLateMinutes) {
        this.clockOutLateMinutes = clockOutLateMinutes;
    }

    public Integer getEarlyOutThresholdMinutes() {
        return earlyOutThresholdMinutes;
    }

    public void setEarlyOutThresholdMinutes(Integer earlyOutThresholdMinutes) {
        this.earlyOutThresholdMinutes = earlyOutThresholdMinutes;
    }

    public Integer getHalfDayEarlyThresholdMinutes() {
        return halfDayEarlyThresholdMinutes;
    }

    public void setHalfDayEarlyThresholdMinutes(Integer halfDayEarlyThresholdMinutes) {
        this.halfDayEarlyThresholdMinutes = halfDayEarlyThresholdMinutes;
    }

    public Integer getFlexLateHours() {
        return flexLateHours;
    }

    public void setFlexLateHours(Integer flexLateHours) {
        this.flexLateHours = flexLateHours;
    }

    public Integer getFlexLateMinutes() {
        return flexLateMinutes;
    }

    public void setFlexLateMinutes(Integer flexLateMinutes) {
        this.flexLateMinutes = flexLateMinutes;
    }

    public Integer getFlexEarlyHours() {
        return flexEarlyHours;
    }

    public void setFlexEarlyHours(Integer flexEarlyHours) {
        this.flexEarlyHours = flexEarlyHours;
    }

    public Integer getFlexEarlyMinutes() {
        return flexEarlyMinutes;
    }

    public void setFlexEarlyMinutes(Integer flexEarlyMinutes) {
        this.flexEarlyMinutes = flexEarlyMinutes;
    }

    public Boolean getHasBreaks() {
        return hasBreaks;
    }

    public void setHasBreaks(Boolean hasBreaks) {
        this.hasBreaks = hasBreaks;
    }

    public Integer getBreakDurationMinutes() {
        return breakDurationMinutes;
    }

    public void setBreakDurationMinutes(Integer breakDurationMinutes) {
        this.breakDurationMinutes = breakDurationMinutes;
    }

    public Integer getWorkingHoursMinutes() {
        return workingHoursMinutes;
    }

    public void setWorkingHoursMinutes(Integer workingHoursMinutes) {
        this.workingHoursMinutes = workingHoursMinutes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
