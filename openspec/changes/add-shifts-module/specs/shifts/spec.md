# shifts Specification

## Purpose
Manage shift definitions that specify working time windows, tolerance thresholds, and break rules for the HCMS Time & Attendance system. Shifts are the foundational building blocks for patterns, schedules, and attendance calculation.

## ADDED Requirements

### Requirement: Shift Data Model
The system SHALL store shift definitions with all necessary fields for attendance management.

#### Scenario: Shift entity contains required fields
- **GIVEN** a shift is created
- **THEN** the shift record contains:
  - Unique code (e.g., "DAY", "NIGHT")
  - Display name
  - Start time and end time
  - Overnight flag (for shifts crossing midnight)
  - Grace period for late arrival (minutes)
  - Grace period for early departure (minutes)
  - Late threshold (minutes after which marked late)
  - Early departure threshold (minutes)
  - Break duration (minutes)
  - Calculated working hours
  - Status (ACTIVE/INACTIVE)
  - Audit timestamps (created_at, updated_at)

#### Scenario: Overnight shift calculation
- **GIVEN** a shift with startTime=22:00 and endTime=06:00
- **AND** isOvernight=true
- **WHEN** working hours are calculated
- **THEN** result is 480 minutes (8 hours) minus break duration

---

### Requirement: List Shifts
The system SHALL allow users to view a paginated list of all shift definitions.

#### Scenario: View shifts list
- **GIVEN** user is authenticated
- **WHEN** user navigates to `/shifts`
- **THEN** system displays a table with columns: Code, Name, Time, Status, Actions
- **AND** results are paginated (default 20 per page)
- **AND** active shifts are shown first

#### Scenario: Filter shifts by status
- **GIVEN** user is on shifts list page
- **WHEN** user selects "Active" from status filter
- **THEN** only shifts with status=ACTIVE are displayed

#### Scenario: Search shifts
- **GIVEN** user is on shifts list page
- **WHEN** user types "night" in search box
- **THEN** shifts matching "night" in code or name are displayed

---

### Requirement: Create Shift
The system SHALL allow authorized users to create new shift definitions.

#### Scenario: Create shift with valid data
- **GIVEN** user has HR_ADMIN or ADMIN role
- **WHEN** user submits create shift form with:
  - code: "DAY"
  - name: "Day Shift"
  - startTime: "09:00"
  - endTime: "17:00"
  - breakDurationMinutes: 60
- **THEN** system creates the shift
- **AND** returns 201 Created with shift data
- **AND** shift appears in the list

#### Scenario: Create overnight shift
- **GIVEN** user has HR_ADMIN or ADMIN role
- **WHEN** user submits create shift form with:
  - code: "NIGHT"
  - startTime: "22:00"
  - endTime: "06:00"
  - isOvernight: true
- **THEN** system creates the shift
- **AND** working hours are calculated correctly (8 hours)

#### Scenario: Reject duplicate code
- **GIVEN** shift with code "DAY" already exists
- **WHEN** user attempts to create another shift with code "DAY"
- **THEN** system returns 409 Conflict
- **AND** error message indicates duplicate code

#### Scenario: Unauthorized user cannot create
- **GIVEN** user has EMPLOYEE role only
- **WHEN** user attempts to create a shift
- **THEN** system returns 403 Forbidden

---

### Requirement: Update Shift
The system SHALL allow authorized users to update existing shift definitions.

#### Scenario: Update shift name
- **GIVEN** shift with id=1 exists
- **AND** user has HR_ADMIN role
- **WHEN** user updates name to "Morning Shift"
- **THEN** system updates the shift
- **AND** returns 200 OK with updated data
- **AND** updated_at timestamp is refreshed

#### Scenario: Update shift not found
- **GIVEN** no shift with id=999 exists
- **WHEN** user attempts to update shift 999
- **THEN** system returns 404 Not Found

---

### Requirement: Delete Shift
The system SHALL allow authorized users to soft-delete shift definitions.

#### Scenario: Delete shift (soft delete)
- **GIVEN** shift with id=1 exists and status=ACTIVE
- **AND** user has ADMIN role
- **WHEN** user deletes the shift
- **THEN** system sets status to INACTIVE
- **AND** shift is hidden from default list view
- **AND** returns 200 OK

#### Scenario: Confirm before delete
- **GIVEN** user clicks delete button on a shift
- **WHEN** confirmation dialog appears
- **AND** user confirms deletion
- **THEN** delete request is sent to API

---

### Requirement: Shift Form Validation
The system SHALL validate shift data on both frontend and backend.

#### Scenario: Required field validation
- **GIVEN** user submits shift form with empty code
- **THEN** form displays error "Code is required"
- **AND** form is not submitted

#### Scenario: Time format validation
- **GIVEN** user enters invalid time "25:00"
- **THEN** form displays error "Invalid time format"

#### Scenario: Grace period range validation
- **GIVEN** user enters gracePeriodInMinutes = 200
- **WHEN** form is submitted
- **THEN** backend returns 400 Bad Request
- **AND** error indicates grace period must be 0-120 minutes

---

### Requirement: Shifts API
The system SHALL expose RESTful endpoints for shift management.

#### Scenario: GET /api/v1/shifts
- **GIVEN** 3 shifts exist in database
- **WHEN** client sends GET /api/v1/shifts
- **THEN** response contains paginated list of shifts
- **AND** response includes pagination metadata (page, size, totalElements)

#### Scenario: GET /api/v1/shifts/{id}
- **GIVEN** shift with id=1 exists
- **WHEN** client sends GET /api/v1/shifts/1
- **THEN** response contains full shift details

#### Scenario: POST /api/v1/shifts
- **GIVEN** valid shift payload
- **WHEN** client sends POST /api/v1/shifts
- **THEN** response is 201 Created
- **AND** Location header contains new resource URL

#### Scenario: PUT /api/v1/shifts/{id}
- **GIVEN** shift with id=1 exists
- **WHEN** client sends PUT /api/v1/shifts/1 with updated data
- **THEN** response is 200 OK with updated shift

#### Scenario: DELETE /api/v1/shifts/{id}
- **GIVEN** shift with id=1 exists
- **WHEN** client sends DELETE /api/v1/shifts/1
- **THEN** response is 200 OK
- **AND** shift status is set to INACTIVE
