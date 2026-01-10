-- V002__create_shifts_table.sql
-- Create shifts table with all required fields for shift management

CREATE TABLE shifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_overnight BOOLEAN DEFAULT FALSE,
    grace_period_in_minutes INT DEFAULT 0,
    grace_period_out_minutes INT DEFAULT 10,
    late_threshold_minutes INT DEFAULT 0,
    early_departure_threshold_minutes INT DEFAULT 0,
    break_duration_minutes INT DEFAULT 0,
    working_hours_minutes INT,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    CONSTRAINT fk_shift_created_by FOREIGN KEY (created_by) REFERENCES user(id) ON DELETE SET NULL,
    CONSTRAINT fk_shift_updated_by FOREIGN KEY (updated_by) REFERENCES user(id) ON DELETE SET NULL,
    CONSTRAINT chk_grace_period_in CHECK (grace_period_in_minutes >= 0 AND grace_period_in_minutes <= 120),
    CONSTRAINT chk_grace_period_out CHECK (grace_period_out_minutes >= 0 AND grace_period_out_minutes <= 120),
    CONSTRAINT chk_late_threshold CHECK (late_threshold_minutes >= 0 AND late_threshold_minutes <= 480),
    CONSTRAINT chk_early_threshold CHECK (early_departure_threshold_minutes >= 0 AND early_departure_threshold_minutes <= 480),
    CONSTRAINT chk_break_duration CHECK (break_duration_minutes >= 0 AND break_duration_minutes <= 240)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_shift_code ON shifts(code);
CREATE INDEX idx_shift_status ON shifts(status);
CREATE INDEX idx_shift_created_at ON shifts(created_at);
