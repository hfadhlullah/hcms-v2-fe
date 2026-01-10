package com.example.hcms.shift.dto;

import jakarta.validation.constraints.*;

/**
 * DTO for creating a new shift - Lark-style
 */
public class CreateShiftRequest {

    @NotBlank(message = "Shift name is required")
    @Size(min = 1, max = 64, message = "Name must be between 1 and 64 characters")
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    // Shift type: FIXED_TIME or FLEXTIME
    @NotNull(message = "Shift type is required")
    private String shiftType = "FIXED_TIME";

    // Date type: WORK_DAYS or OFF_DAYS
    @NotNull(message = "Date type is required")
    private String dateType = "WORK_DAYS";

    // Time Parameters
    @NotNull(message = "Start time is required")
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Start time must be in HH:mm format")
    private String startTime;

    @NotNull(message = "End time is required")
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "End time must be in HH:mm format")
    private String endTime;

    private Boolean isNextDayEnd = false;

    private Boolean requireClockIn = true;
    private Boolean requireClockOut = true;

    // Clock-In Rules
    @Min(value = 0, message = "Clock in early minutes must be at least 0")
    @Max(value = 480, message = "Clock in early minutes must not exceed 480")
    private Integer clockInEarlyMinutes = 60;

    @Min(value = 0, message = "Late threshold must be at least 0")
    @Max(value = 480, message = "Late threshold must not exceed 480")
    private Integer lateThresholdMinutes = 0;

    @Min(value = 0, message = "Half day late threshold must be at least 0")
    @Max(value = 480, message = "Half day late threshold must not exceed 480")
    private Integer halfDayLateThresholdMinutes = 30;

    // Clock-Out Rules
    @Min(value = 0, message = "Clock out late minutes must be at least 0")
    @Max(value = 960, message = "Clock out late minutes must not exceed 960")
    private Integer clockOutLateMinutes = 480;

    @Min(value = 0, message = "Early out threshold must be at least 0")
    @Max(value = 480, message = "Early out threshold must not exceed 480")
    private Integer earlyOutThresholdMinutes = 0;

    @Min(value = 0, message = "Half day early threshold must be at least 0")
    @Max(value = 480, message = "Half day early threshold must not exceed 480")
    private Integer halfDayEarlyThresholdMinutes = 30;

    // Flextime settings
    @Min(value = 0, message = "Flex late hours must be at least 0")
    @Max(value = 12, message = "Flex late hours must not exceed 12")
    private Integer flexLateHours = 1;

    @Min(value = 0, message = "Flex late minutes must be at least 0")
    @Max(value = 59, message = "Flex late minutes must not exceed 59")
    private Integer flexLateMinutes = 0;

    @Min(value = 0, message = "Flex early hours must be at least 0")
    @Max(value = 12, message = "Flex early hours must not exceed 12")
    private Integer flexEarlyHours = 1;

    @Min(value = 0, message = "Flex early minutes must be at least 0")
    @Max(value = 59, message = "Flex early minutes must not exceed 59")
    private Integer flexEarlyMinutes = 0;

    // Break settings
    private Boolean hasBreaks = false;

    @Min(value = 0, message = "Break duration must be at least 0")
    @Max(value = 240, message = "Break duration must not exceed 240 minutes")
    private Integer breakDurationMinutes = 0;

    public CreateShiftRequest() {
    }

    // Getters and Setters
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
}
