package com.example.hcms.attendancegroup.dto;

import com.example.hcms.attendancegroup.domain.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for AttendanceGroup
 */
public class AttendanceGroupResponse {

    private Long id;
    private String name;
    private Long ownerId;
    private List<Long> subOwnerIds;
    private String timezone;
    private Boolean relocationSync;

    // Member tracking
    private MemberTrackingMode memberTrackingRequired;
    private String memberTrackingRequiredConditions;
    private MemberTrackingMode memberTrackingOptional;
    private String memberTrackingOptionalConditions;

    // Shift settings
    private GroupShiftType shiftType;
    private Long defaultShiftId;
    private String defaultShiftName; // Populated from Shift entity
    private String defaultShiftTime; // e.g., "09:00 ~ 18:00"

    // Weekly schedule
    private Long mondayShiftId;
    private Long tuesdayShiftId;
    private Long wednesdayShiftId;
    private Long thursdayShiftId;
    private Long fridayShiftId;
    private Long saturdayShiftId;
    private Long sundayShiftId;

    // Schedule settings
    private Boolean usePublicHolidays;
    private List<String> specialDays;

    // Attendance settings
    private Boolean requirePhoto;
    private Boolean allowOffsite;
    private AttendancePolicy outOfOfficePolicy;
    private AttendancePolicy businessTripPolicy;
    private LeaveAttendancePolicy partialLeavePolicy;
    private Boolean recordOvertime;
    private Boolean nonWorkingDayApproval;
    private String nonWorkingDayResetTime;
    private Boolean allowCorrections;
    private List<String> correctionTypes;

    // Metadata
    private AttendanceGroupStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Computed fields for list view
    private Integer memberCount;

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

    public List<Long> getSubOwnerIds() {
        return subOwnerIds;
    }

    public void setSubOwnerIds(List<Long> subOwnerIds) {
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

    public Long getDefaultShiftId() {
        return defaultShiftId;
    }

    public void setDefaultShiftId(Long defaultShiftId) {
        this.defaultShiftId = defaultShiftId;
    }

    public String getDefaultShiftName() {
        return defaultShiftName;
    }

    public void setDefaultShiftName(String defaultShiftName) {
        this.defaultShiftName = defaultShiftName;
    }

    public String getDefaultShiftTime() {
        return defaultShiftTime;
    }

    public void setDefaultShiftTime(String defaultShiftTime) {
        this.defaultShiftTime = defaultShiftTime;
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

    public List<String> getSpecialDays() {
        return specialDays;
    }

    public void setSpecialDays(List<String> specialDays) {
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

    public String getNonWorkingDayResetTime() {
        return nonWorkingDayResetTime;
    }

    public void setNonWorkingDayResetTime(String nonWorkingDayResetTime) {
        this.nonWorkingDayResetTime = nonWorkingDayResetTime;
    }

    public Boolean getAllowCorrections() {
        return allowCorrections;
    }

    public void setAllowCorrections(Boolean allowCorrections) {
        this.allowCorrections = allowCorrections;
    }

    public List<String> getCorrectionTypes() {
        return correctionTypes;
    }

    public void setCorrectionTypes(List<String> correctionTypes) {
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

    public Integer getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }
}
