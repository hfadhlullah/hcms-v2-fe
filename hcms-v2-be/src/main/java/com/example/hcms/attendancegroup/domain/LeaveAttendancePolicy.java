package com.example.hcms.attendancegroup.domain;

/**
 * Attendance policy for partial day leave
 */
public enum LeaveAttendancePolicy {
    NO_CLOCK, // No clock in/out required for leave
    ON_LEAVE_RETURN // Clock in/out required upon leaving or returning for leave
}
