package com.example.hcms.attendancegroup.domain;

import com.example.hcms.shift.domain.Shift;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Attendance Group entity - groups employees with shared attendance settings
 */
@Entity
@Table(name = "attendance_groups")
public class AttendanceGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "sub_owner_ids", columnDefinition = "TEXT")
    private String subOwnerIds; // JSON array of user IDs

    @Column(length = 50)
    private String timezone = "GMT+07:00";

    @Column(name = "relocation_sync")
    private Boolean relocationSync = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_tracking_required", columnDefinition = "VARCHAR(20)")
    private MemberTrackingMode memberTrackingRequired = MemberTrackingMode.NONE;

    @Column(name = "member_tracking_required_conditions", columnDefinition = "TEXT")
    private String memberTrackingRequiredConditions; // JSON for custom conditions

    @Enumerated(EnumType.STRING)
    @Column(name = "member_tracking_optional", columnDefinition = "VARCHAR(20)")
    private MemberTrackingMode memberTrackingOptional = MemberTrackingMode.NONE;

    @Column(name = "member_tracking_optional_conditions", columnDefinition = "TEXT")
    private String memberTrackingOptionalConditions; // JSON for custom conditions

    // Shift settings
    @Enumerated(EnumType.STRING)
    @Column(name = "shift_type", columnDefinition = "VARCHAR(20)")
    private GroupShiftType shiftType = GroupShiftType.FIXED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_shift_id")
    private Shift defaultShift;

    // Weekly schedule - references to Shift IDs for each day
    @Column(name = "monday_shift_id")
    private Long mondayShiftId;

    @Column(name = "tuesday_shift_id")
    private Long tuesdayShiftId;

    @Column(name = "wednesday_shift_id")
    private Long wednesdayShiftId;

    @Column(name = "thursday_shift_id")
    private Long thursdayShiftId;

    @Column(name = "friday_shift_id")
    private Long fridayShiftId;

    @Column(name = "saturday_shift_id")
    private Long saturdayShiftId;

    @Column(name = "sunday_shift_id")
    private Long sundayShiftId;

    // Schedule settings
    @Column(name = "use_public_holidays")
    private Boolean usePublicHolidays = false;

    @Column(name = "special_days", columnDefinition = "TEXT")
    private String specialDays; // JSON array of special dates

    // Attendance settings
    @Column(name = "require_photo")
    private Boolean requirePhoto = false;

    @Column(name = "allow_offsite")
    private Boolean allowOffsite = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "out_of_office_policy", columnDefinition = "VARCHAR(30)")
    private AttendancePolicy outOfOfficePolicy = AttendancePolicy.NO_CLOCK;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_trip_policy", columnDefinition = "VARCHAR(30)")
    private AttendancePolicy businessTripPolicy = AttendancePolicy.NO_CLOCK;

    @Enumerated(EnumType.STRING)
    @Column(name = "partial_leave_policy", columnDefinition = "VARCHAR(30)")
    private LeaveAttendancePolicy partialLeavePolicy = LeaveAttendancePolicy.NO_CLOCK;

    @Column(name = "record_overtime")
    private Boolean recordOvertime = false;

    @Column(name = "non_working_day_approval")
    private Boolean nonWorkingDayApproval = false;

    @Column(name = "non_working_day_reset_time")
    private LocalTime nonWorkingDayResetTime = LocalTime.of(4, 0);

    @Column(name = "allow_corrections")
    private Boolean allowCorrections = true;

    @Column(name = "correction_types", columnDefinition = "TEXT")
    private String correctionTypes; // JSON array: ["NO_RECORD", "LATE_IN", "EARLY_OUT", "REGULAR"]

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20)")
    private AttendanceGroupStatus status = AttendanceGroupStatus.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getSubOwnerIds() {
        return subOwnerIds;
    }

    public void setSubOwnerIds(String subOwnerIds) {
        this.subOwnerIds = subOwnerIds;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Boolean getRelocationSync() {
        return relocationSync;
    }

    public void setRelocationSync(Boolean relocationSync) {
        this.relocationSync = relocationSync;
    }

    public MemberTrackingMode getMemberTrackingRequired() {
        return memberTrackingRequired;
    }

    public void setMemberTrackingRequired(MemberTrackingMode memberTrackingRequired) {
        this.memberTrackingRequired = memberTrackingRequired;
    }

    public String getMemberTrackingRequiredConditions() {
        return memberTrackingRequiredConditions;
    }

    public void setMemberTrackingRequiredConditions(String memberTrackingRequiredConditions) {
        this.memberTrackingRequiredConditions = memberTrackingRequiredConditions;
    }

    public MemberTrackingMode getMemberTrackingOptional() {
        return memberTrackingOptional;
    }

    public void setMemberTrackingOptional(MemberTrackingMode memberTrackingOptional) {
        this.memberTrackingOptional = memberTrackingOptional;
    }

    public String getMemberTrackingOptionalConditions() {
        return memberTrackingOptionalConditions;
    }

    public void setMemberTrackingOptionalConditions(String memberTrackingOptionalConditions) {
        this.memberTrackingOptionalConditions = memberTrackingOptionalConditions;
    }

    public GroupShiftType getShiftType() {
        return shiftType;
    }

    public void setShiftType(GroupShiftType shiftType) {
        this.shiftType = shiftType;
    }

    public Shift getDefaultShift() {
        return defaultShift;
    }

    public void setDefaultShift(Shift defaultShift) {
        this.defaultShift = defaultShift;
    }

    public Long getMondayShiftId() {
        return mondayShiftId;
    }

    public void setMondayShiftId(Long mondayShiftId) {
        this.mondayShiftId = mondayShiftId;
    }

    public Long getTuesdayShiftId() {
        return tuesdayShiftId;
    }

    public void setTuesdayShiftId(Long tuesdayShiftId) {
        this.tuesdayShiftId = tuesdayShiftId;
    }

    public Long getWednesdayShiftId() {
        return wednesdayShiftId;
    }

    public void setWednesdayShiftId(Long wednesdayShiftId) {
        this.wednesdayShiftId = wednesdayShiftId;
    }

    public Long getThursdayShiftId() {
        return thursdayShiftId;
    }

    public void setThursdayShiftId(Long thursdayShiftId) {
        this.thursdayShiftId = thursdayShiftId;
    }

    public Long getFridayShiftId() {
        return fridayShiftId;
    }

    public void setFridayShiftId(Long fridayShiftId) {
        this.fridayShiftId = fridayShiftId;
    }

    public Long getSaturdayShiftId() {
        return saturdayShiftId;
    }

    public void setSaturdayShiftId(Long saturdayShiftId) {
        this.saturdayShiftId = saturdayShiftId;
    }

    public Long getSundayShiftId() {
        return sundayShiftId;
    }

    public void setSundayShiftId(Long sundayShiftId) {
        this.sundayShiftId = sundayShiftId;
    }

    public Boolean getUsePublicHolidays() {
        return usePublicHolidays;
    }

    public void setUsePublicHolidays(Boolean usePublicHolidays) {
        this.usePublicHolidays = usePublicHolidays;
    }

    public String getSpecialDays() {
        return specialDays;
    }

    public void setSpecialDays(String specialDays) {
        this.specialDays = specialDays;
    }

    public Boolean getRequirePhoto() {
        return requirePhoto;
    }

    public void setRequirePhoto(Boolean requirePhoto) {
        this.requirePhoto = requirePhoto;
    }

    public Boolean getAllowOffsite() {
        return allowOffsite;
    }

    public void setAllowOffsite(Boolean allowOffsite) {
        this.allowOffsite = allowOffsite;
    }

    public AttendancePolicy getOutOfOfficePolicy() {
        return outOfOfficePolicy;
    }

    public void setOutOfOfficePolicy(AttendancePolicy outOfOfficePolicy) {
        this.outOfOfficePolicy = outOfOfficePolicy;
    }

    public AttendancePolicy getBusinessTripPolicy() {
        return businessTripPolicy;
    }

    public void setBusinessTripPolicy(AttendancePolicy businessTripPolicy) {
        this.businessTripPolicy = businessTripPolicy;
    }

    public LeaveAttendancePolicy getPartialLeavePolicy() {
        return partialLeavePolicy;
    }

    public void setPartialLeavePolicy(LeaveAttendancePolicy partialLeavePolicy) {
        this.partialLeavePolicy = partialLeavePolicy;
    }

    public Boolean getRecordOvertime() {
        return recordOvertime;
    }

    public void setRecordOvertime(Boolean recordOvertime) {
        this.recordOvertime = recordOvertime;
    }

    public Boolean getNonWorkingDayApproval() {
        return nonWorkingDayApproval;
    }

    public void setNonWorkingDayApproval(Boolean nonWorkingDayApproval) {
        this.nonWorkingDayApproval = nonWorkingDayApproval;
    }

    public LocalTime getNonWorkingDayResetTime() {
        return nonWorkingDayResetTime;
    }

    public void setNonWorkingDayResetTime(LocalTime nonWorkingDayResetTime) {
        this.nonWorkingDayResetTime = nonWorkingDayResetTime;
    }

    public Boolean getAllowCorrections() {
        return allowCorrections;
    }

    public void setAllowCorrections(Boolean allowCorrections) {
        this.allowCorrections = allowCorrections;
    }

    public String getCorrectionTypes() {
        return correctionTypes;
    }

    public void setCorrectionTypes(String correctionTypes) {
        this.correctionTypes = correctionTypes;
    }

    public AttendanceGroupStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceGroupStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
