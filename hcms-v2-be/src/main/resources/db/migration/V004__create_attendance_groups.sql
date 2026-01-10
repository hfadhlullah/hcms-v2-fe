-- Attendance Groups table
CREATE TABLE attendance_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    owner_id BIGINT,
    sub_owner_ids TEXT,
    timezone VARCHAR(50) DEFAULT 'GMT+07:00',
    relocation_sync BOOLEAN DEFAULT FALSE,
    
    -- Member tracking settings
    member_tracking_required VARCHAR(20) DEFAULT 'NONE',
    member_tracking_required_conditions TEXT,
    member_tracking_optional VARCHAR(20) DEFAULT 'NONE',
    member_tracking_optional_conditions TEXT,
    
    -- Shift settings
    shift_type VARCHAR(20) DEFAULT 'FIXED',
    default_shift_id BIGINT,
    
    -- Weekly schedule (references to shifts table)
    monday_shift_id BIGINT,
    tuesday_shift_id BIGINT,
    wednesday_shift_id BIGINT,
    thursday_shift_id BIGINT,
    friday_shift_id BIGINT,
    saturday_shift_id BIGINT,
    sunday_shift_id BIGINT,
    
    -- Schedule settings
    use_public_holidays BOOLEAN DEFAULT FALSE,
    special_days TEXT,
    
    -- Attendance settings
    require_photo BOOLEAN DEFAULT FALSE,
    allow_offsite BOOLEAN DEFAULT FALSE,
    out_of_office_policy VARCHAR(30) DEFAULT 'NO_CLOCK',
    business_trip_policy VARCHAR(30) DEFAULT 'NO_CLOCK',
    partial_leave_policy VARCHAR(30) DEFAULT 'NO_CLOCK',
    record_overtime BOOLEAN DEFAULT FALSE,
    non_working_day_approval BOOLEAN DEFAULT FALSE,
    non_working_day_reset_time TIME DEFAULT '04:00:00',
    allow_corrections BOOLEAN DEFAULT TRUE,
    correction_types TEXT,
    
    -- Status and timestamps
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_attendance_groups_status (status),
    INDEX idx_attendance_groups_name (name),
    INDEX idx_attendance_groups_owner (owner_id),
    
    -- Foreign keys
    CONSTRAINT fk_attendance_groups_default_shift 
        FOREIGN KEY (default_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_groups_monday_shift 
        FOREIGN KEY (monday_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_groups_tuesday_shift 
        FOREIGN KEY (tuesday_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_groups_wednesday_shift 
        FOREIGN KEY (wednesday_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_groups_thursday_shift 
        FOREIGN KEY (thursday_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_groups_friday_shift 
        FOREIGN KEY (friday_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_groups_saturday_shift 
        FOREIGN KEY (saturday_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_groups_sunday_shift 
        FOREIGN KEY (sunday_shift_id) REFERENCES shifts(id) ON DELETE SET NULL
);
