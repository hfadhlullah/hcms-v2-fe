# Design: Shifts Module

## Overview
The Shifts module provides the foundation for time & attendance by defining working time windows. Each shift specifies when work starts/ends, tolerance thresholds, and break rules.

## Data Model

### Shift Entity
```
shifts
├── id (BIGINT, PK, auto-increment)
├── code (VARCHAR(20), unique, not null) - e.g., "DAY", "NIGHT", "SWING"
├── name (VARCHAR(100), not null) - e.g., "Day Shift", "Night Shift"
├── description (VARCHAR(500), nullable)
├── start_time (TIME, not null) - e.g., 08:00:00
├── end_time (TIME, not null) - e.g., 17:00:00
├── is_overnight (BOOLEAN, default false) - true if shift crosses midnight
├── grace_period_in_minutes (INT, default 0) - late arrival tolerance
├── grace_period_out_minutes (INT, default 0) - early departure tolerance
├── late_threshold_minutes (INT, default 0) - minutes after which marked "late"
├── early_departure_threshold_minutes (INT, default 0) - minutes before which marked "early"
├── break_duration_minutes (INT, default 0) - total break time
├── working_hours_minutes (INT, computed/stored) - net working hours
├── status (ENUM: ACTIVE, INACTIVE, default ACTIVE)
├── created_at (TIMESTAMP, not null)
├── updated_at (TIMESTAMP, not null)
├── created_by (BIGINT, FK to users, nullable)
└── updated_by (BIGINT, FK to users, nullable)
```

### Computed Fields
- `working_hours_minutes`: Calculated as (end_time - start_time - break_duration), handling overnight shifts

## API Design

### Endpoints
```
GET    /api/v1/shifts           - List all shifts (paginated)
GET    /api/v1/shifts/{id}      - Get shift by ID
POST   /api/v1/shifts           - Create new shift
PUT    /api/v1/shifts/{id}      - Update shift
DELETE /api/v1/shifts/{id}      - Soft delete (set status=INACTIVE)
```

### Request/Response DTOs

#### CreateShiftRequest
```json
{
  "code": "DAY",
  "name": "Day Shift",
  "description": "Standard 9-5 working hours",
  "startTime": "09:00",
  "endTime": "17:00",
  "isOvernight": false,
  "gracePeriodInMinutes": 15,
  "gracePeriodOutMinutes": 10,
  "lateThresholdMinutes": 30,
  "earlyDepartureThresholdMinutes": 30,
  "breakDurationMinutes": 60
}
```

#### ShiftResponse
```json
{
  "id": 1,
  "code": "DAY",
  "name": "Day Shift",
  "description": "Standard 9-5 working hours",
  "startTime": "09:00",
  "endTime": "17:00",
  "isOvernight": false,
  "gracePeriodInMinutes": 15,
  "gracePeriodOutMinutes": 10,
  "lateThresholdMinutes": 30,
  "earlyDepartureThresholdMinutes": 30,
  "breakDurationMinutes": 60,
  "workingHoursMinutes": 420,
  "status": "ACTIVE",
  "createdAt": "2025-12-31T10:00:00Z",
  "updatedAt": "2025-12-31T10:00:00Z"
}
```

### Pagination Response
```json
{
  "content": [...shifts],
  "page": 0,
  "size": 20,
  "totalElements": 50,
  "totalPages": 3
}
```

## Frontend Architecture

### Components
```
frontend/src/
├── pages/
│   └── ShiftsPage.tsx              # Main shifts list page
├── components/shifts/
│   ├── ShiftList.tsx               # Table/grid of shifts
│   ├── ShiftCard.tsx               # Individual shift card (optional)
│   ├── ShiftForm.tsx               # Create/Edit form
│   ├── ShiftFormModal.tsx          # Modal wrapper for form
│   ├── ShiftDeleteDialog.tsx       # Confirmation dialog
│   └── ShiftFilters.tsx            # Status filter, search
├── api/
│   └── shiftsApi.ts                # API client functions
└── types/
    └── shift.ts                    # TypeScript interfaces
```

### Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Shifts                                        [+ New Shift] │
├─────────────────────────────────────────────────────────────┤
│  [Search...] [Status: All ▼]                                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Code   │ Name        │ Time         │ Status │ Actions ││
│  ├────────┼─────────────┼──────────────┼────────┼─────────┤│
│  │ DAY    │ Day Shift   │ 09:00-17:00  │ Active │ ✏️ 🗑️   ││
│  │ NIGHT  │ Night Shift │ 22:00-06:00  │ Active │ ✏️ 🗑️   ││
│  │ SWING  │ Swing Shift │ 14:00-22:00  │ Active │ ✏️ 🗑️   ││
│  └─────────────────────────────────────────────────────────┘│
│  [< 1 2 3 >]                                                │
└─────────────────────────────────────────────────────────────┘
```

## Validation Rules

### Backend Validation
- `code`: Required, 2-20 chars, alphanumeric + underscore, unique
- `name`: Required, 2-100 chars
- `startTime`/`endTime`: Required, valid time format (HH:mm)
- `isOvernight`: If true, endTime < startTime is valid (crosses midnight)
- Grace periods: 0-120 minutes
- Thresholds: 0-480 minutes
- Break duration: 0-240 minutes

### Business Rules
- Code must be unique (case-insensitive)
- Cannot delete shift if referenced by active patterns/schedules (future)
- Soft delete sets status to INACTIVE

## Security

### Authorization
- **View shifts**: Authenticated users (all roles)
- **Create/Edit/Delete**: HR_ADMIN, ADMIN roles only

### Audit
- Log all create/update/delete operations with user ID and timestamp
