package com.example.hcms.attendancegroup.domain;

/**
 * Attendance policy for out-of-office, business trip scenarios
 */
public enum AttendancePolicy {
    NO_CLOCK, // No clock in/out required
    SHIFT_TIMES, // Record at start and end times of each shift
    BEFORE_AFTER // Record before leaving and upon returning
}
