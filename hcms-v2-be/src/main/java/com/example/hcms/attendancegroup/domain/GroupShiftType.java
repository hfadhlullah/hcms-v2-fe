package com.example.hcms.attendancegroup.domain;

/**
 * Type of shift scheduling for the attendance group
 */
public enum GroupShiftType {
    FIXED, // All members clock in/out at the same time
    SCHEDULED, // Customize individual shifts
    FREE // Clock in/out any time with no shifts scheduled
}
