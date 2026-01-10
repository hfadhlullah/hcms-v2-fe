package com.example.hcms.shift.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalTime;

/**
 * Shift entity - Lark-style shift definition with time parameters and rules
 */
@Entity
@Table(name = "shifts")
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String code;

    @Column(length = 64, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    private ShiftType shiftType = ShiftType.FIXED_TIME;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "VARCHAR(20)")
    private DateType dateType = DateType.WORK_DAYS;

    // Time Parameters
    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Boolean isNextDayEnd = false;

    @Column(nullable = false)
    private Boolean requireClockIn = true;

    @Column(nullable = false)
    private Boolean requireClockOut = true;

    // Clock-In Rules
    @Column(nullable = false)
    private Integer clockInEarlyMinutes = 60;

    @Column(nullable = false)
    private Integer lateThresholdMinutes = 0;

    @Column(nullable = false)
    private Integer halfDayLateThresholdMinutes = 30;

    // Clock-Out Rules
    @Column(nullable = false)
    private Integer clockOutLateMinutes = 480;

    @Column(nullable = false)
    private Integer earlyOutThresholdMinutes = 0;

    @Column(nullable = false)
    private Integer halfDayEarlyThresholdMinutes = 30;

    // Flextime settings
    @Column(nullable = false)
    private Integer flexLateHours = 1;

    @Column(nullable = false)
    private Integer flexLateMinutes = 0;

    @Column(nullable = false)
    private Integer flexEarlyHours = 1;

    @Column(nullable = false)
    private Integer flexEarlyMinutes = 0;

    // Break settings
    @Column(nullable = false)
    private Boolean hasBreaks = false;

    @Column(nullable = false)
    private Integer breakDurationMinutes = 0;

    // Calculated field
    @Column(nullable = true)
    private Integer workingHoursMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftStatus status = ShiftStatus.ACTIVE;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = true)
    private Long createdBy;

    @Column(nullable = true)
    private Long updatedBy;

    // Legacy fields (kept for backward compatibility)
    @Column(nullable = true)
    private Boolean isOvernight;

    @Column(nullable = true)
    private Integer gracePeriodInMinutes;

    @Column(nullable = true)
    private Integer gracePeriodOutMinutes;

    @Column(nullable = true)
    private Integer earlyDepartureThresholdMinutes;

    public Shift() {
    }

    public Shift(String name, LocalTime startTime, LocalTime endTime) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.shiftType = ShiftType.FIXED_TIME;
        this.dateType = DateType.WORK_DAYS;
        this.status = ShiftStatus.ACTIVE;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        calculateWorkingHours();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
        calculateWorkingHours();
    }

    public void calculateWorkingHours() {
        if (startTime != null && endTime != null) {
            int minutes;
            if (Boolean.TRUE.equals(isNextDayEnd)) {
                // For next day shifts: minutes from start to midnight + minutes from midnight
                // to end
                minutes = (24 * 60 - startTime.getHour() * 60 - startTime.getMinute())
                        + (endTime.getHour() * 60 + endTime.getMinute());
            } else {
                // For same day shifts: simple difference
                minutes = (endTime.getHour() * 60 + endTime.getMinute())
                        - (startTime.getHour() * 60 + startTime.getMinute());
            }
            // Subtract break duration if breaks are enabled
            if (Boolean.TRUE.equals(hasBreaks) && breakDurationMinutes != null) {
                minutes -= breakDurationMinutes;
            }
            this.workingHoursMinutes = Math.max(0, minutes);
        }
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

    public ShiftType getShiftType() {
        return shiftType;
    }

    public void setShiftType(ShiftType shiftType) {
        this.shiftType = shiftType != null ? shiftType : ShiftType.FIXED_TIME;
    }

    public DateType getDateType() {
        return dateType;
    }

    public void setDateType(DateType dateType) {
        this.dateType = dateType != null ? dateType : DateType.WORK_DAYS;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Boolean getIsNextDayEnd() {
        return isNextDayEnd;
    }

    public void setIsNextDayEnd(Boolean isNextDayEnd) {
        this.isNextDayEnd = isNextDayEnd != null ? isNextDayEnd : false;
    }

    public Boolean getRequireClockIn() {
        return requireClockIn;
    }

    public void setRequireClockIn(Boolean requireClockIn) {
        this.requireClockIn = requireClockIn != null ? requireClockIn : true;
    }

    public Boolean getRequireClockOut() {
        return requireClockOut;
    }

    public void setRequireClockOut(Boolean requireClockOut) {
        this.requireClockOut = requireClockOut != null ? requireClockOut : true;
    }

    public Integer getClockInEarlyMinutes() {
        return clockInEarlyMinutes;
    }

    public void setClockInEarlyMinutes(Integer clockInEarlyMinutes) {
        this.clockInEarlyMinutes = clockInEarlyMinutes != null ? clockInEarlyMinutes : 60;
    }

    public Integer getLateThresholdMinutes() {
        return lateThresholdMinutes;
    }

    public void setLateThresholdMinutes(Integer lateThresholdMinutes) {
        this.lateThresholdMinutes = lateThresholdMinutes != null ? lateThresholdMinutes : 0;
    }

    public Integer getHalfDayLateThresholdMinutes() {
        return halfDayLateThresholdMinutes;
    }

    public void setHalfDayLateThresholdMinutes(Integer halfDayLateThresholdMinutes) {
        this.halfDayLateThresholdMinutes = halfDayLateThresholdMinutes != null ? halfDayLateThresholdMinutes : 30;
    }

    public Integer getClockOutLateMinutes() {
        return clockOutLateMinutes;
    }

    public void setClockOutLateMinutes(Integer clockOutLateMinutes) {
        this.clockOutLateMinutes = clockOutLateMinutes != null ? clockOutLateMinutes : 480;
    }

    public Integer getEarlyOutThresholdMinutes() {
        return earlyOutThresholdMinutes;
    }

    public void setEarlyOutThresholdMinutes(Integer earlyOutThresholdMinutes) {
        this.earlyOutThresholdMinutes = earlyOutThresholdMinutes != null ? earlyOutThresholdMinutes : 0;
    }

    public Integer getHalfDayEarlyThresholdMinutes() {
        return halfDayEarlyThresholdMinutes;
    }

    public void setHalfDayEarlyThresholdMinutes(Integer halfDayEarlyThresholdMinutes) {
        this.halfDayEarlyThresholdMinutes = halfDayEarlyThresholdMinutes != null ? halfDayEarlyThresholdMinutes : 30;
    }

    public Integer getFlexLateHours() {
        return flexLateHours;
    }

    public void setFlexLateHours(Integer flexLateHours) {
        this.flexLateHours = flexLateHours != null ? flexLateHours : 1;
    }

    public Integer getFlexLateMinutes() {
        return flexLateMinutes;
    }

    public void setFlexLateMinutes(Integer flexLateMinutes) {
        this.flexLateMinutes = flexLateMinutes != null ? flexLateMinutes : 0;
    }

    public Integer getFlexEarlyHours() {
        return flexEarlyHours;
    }

    public void setFlexEarlyHours(Integer flexEarlyHours) {
        this.flexEarlyHours = flexEarlyHours != null ? flexEarlyHours : 1;
    }

    public Integer getFlexEarlyMinutes() {
        return flexEarlyMinutes;
    }

    public void setFlexEarlyMinutes(Integer flexEarlyMinutes) {
        this.flexEarlyMinutes = flexEarlyMinutes != null ? flexEarlyMinutes : 0;
    }

    public Boolean getHasBreaks() {
        return hasBreaks;
    }

    public void setHasBreaks(Boolean hasBreaks) {
        this.hasBreaks = hasBreaks != null ? hasBreaks : false;
    }

    public Integer getBreakDurationMinutes() {
        return breakDurationMinutes;
    }

    public void setBreakDurationMinutes(Integer breakDurationMinutes) {
        this.breakDurationMinutes = breakDurationMinutes != null ? breakDurationMinutes : 0;
    }

    public Integer getWorkingHoursMinutes() {
        return workingHoursMinutes;
    }

    public void setWorkingHoursMinutes(Integer workingHoursMinutes) {
        this.workingHoursMinutes = workingHoursMinutes;
    }

    public ShiftStatus getStatus() {
        return status;
    }

    public void setStatus(ShiftStatus status) {
        this.status = status != null ? status : ShiftStatus.ACTIVE;
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

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    // Legacy getters/setters for backward compatibility
    public Boolean getIsOvernight() {
        return isOvernight;
    }

    public void setIsOvernight(Boolean isOvernight) {
        this.isOvernight = isOvernight;
    }

    public Integer getGracePeriodInMinutes() {
        return gracePeriodInMinutes;
    }

    public void setGracePeriodInMinutes(Integer gracePeriodInMinutes) {
        this.gracePeriodInMinutes = gracePeriodInMinutes;
    }

    public Integer getGracePeriodOutMinutes() {
        return gracePeriodOutMinutes;
    }

    public void setGracePeriodOutMinutes(Integer gracePeriodOutMinutes) {
        this.gracePeriodOutMinutes = gracePeriodOutMinutes;
    }

    public Integer getEarlyDepartureThresholdMinutes() {
        return earlyDepartureThresholdMinutes;
    }

    public void setEarlyDepartureThresholdMinutes(Integer earlyDepartureThresholdMinutes) {
        this.earlyDepartureThresholdMinutes = earlyDepartureThresholdMinutes;
    }

    @Override
    public String toString() {
        return "Shift{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", shiftType=" + shiftType +
                ", dateType=" + dateType +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", isNextDayEnd=" + isNextDayEnd +
                ", status=" + status +
                '}';
    }
}
