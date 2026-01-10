-- V003: Update shifts table for Lark-style UI
-- Add new columns for shift type, date type, and clock-in/out rules

-- Add new enum columns
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS shift_type VARCHAR(20) DEFAULT 'FIXED_TIME' NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS date_type VARCHAR(20) DEFAULT 'WORK_DAYS' NOT NULL;

-- Add clock-in/out requirement flags
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS require_clock_in BOOLEAN DEFAULT TRUE NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS require_clock_out BOOLEAN DEFAULT TRUE NOT NULL;

-- Add next day flag for end time (replaces is_overnight)
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS is_next_day_end BOOLEAN DEFAULT FALSE NOT NULL;

-- Clock-In Rules
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS clock_in_early_minutes INTEGER DEFAULT 60 NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS half_day_late_threshold_minutes INTEGER DEFAULT 30 NOT NULL;

-- Clock-Out Rules  
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS clock_out_late_minutes INTEGER DEFAULT 480 NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS early_out_threshold_minutes INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS half_day_early_threshold_minutes INTEGER DEFAULT 30 NOT NULL;

-- Flextime settings (hours and minutes for flexibility)
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS flex_late_hours INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS flex_late_minutes INTEGER DEFAULT 0 NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS flex_early_hours INTEGER DEFAULT 1 NOT NULL;
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS flex_early_minutes INTEGER DEFAULT 0 NOT NULL;

-- Set breaks within working hours flag
ALTER TABLE shifts ADD COLUMN IF NOT EXISTS has_breaks BOOLEAN DEFAULT FALSE NOT NULL;

-- Migrate existing data: copy is_overnight to is_next_day_end
UPDATE shifts SET is_next_day_end = is_overnight WHERE is_overnight IS NOT NULL;

-- Copy existing grace period values to new columns
UPDATE shifts SET clock_in_early_minutes = COALESCE(grace_period_in_minutes, 60);
UPDATE shifts SET clock_out_late_minutes = COALESCE(grace_period_out_minutes, 480);
UPDATE shifts SET early_out_threshold_minutes = COALESCE(early_departure_threshold_minutes, 0);

-- Make code column nullable (MariaDB syntax)
ALTER TABLE shifts MODIFY COLUMN code VARCHAR(20) NULL;

-- Drop unique constraint on code if exists (we'll use name instead)
-- Using MariaDB syntax
SET @exist := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'uk_shift_code' AND TABLE_NAME = 'shifts' AND TABLE_SCHEMA = DATABASE());
SET @sql := IF(@exist > 0, 'ALTER TABLE shifts DROP INDEX uk_shift_code', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
