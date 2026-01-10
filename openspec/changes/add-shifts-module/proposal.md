# Change: Add Shifts Module

## Why
The HCMS system requires shift management as a core feature. Shifts define working time windows that are used for scheduling employees and calculating attendance. Currently, the sidebar links to `/shifts` but no page or backend exists. This is a foundational module that other features (patterns, schedules, attendance) depend on.

## What Changes
- **Backend**: New `shift` module with REST API (`/api/v1/shifts`) supporting full CRUD operations
- **Database**: New `shifts` table with Flyway migration
- **Frontend**: New Shifts page accessible from sidebar with:
  - List view showing all shifts in a table/grid
  - Create shift form (modal or dedicated page)
  - Edit shift functionality
  - Delete/archive shift with confirmation
- **Shift fields**: name, code, start time, end time, grace period (in/out), break duration, late/early thresholds, overnight flag, active status

## Impact
- **Affected specs**: `shifts` (new capability)
- **Affected code**:
  - `backend/src/main/java/com/example/hcms/shift/` (new module)
  - `backend/src/main/resources/db/migration/V002__create_shifts_table.sql` (new)
  - `frontend/src/pages/ShiftsPage.tsx` (new)
  - `frontend/src/components/shifts/` (new components)
  - `frontend/src/api/shiftsApi.ts` (new)
  - `frontend/src/App.tsx` (route update)

## Dependencies
- Requires authentication (existing `auth` module)
- No external dependencies beyond existing tech stack

## Out of Scope
- Shift patterns (separate module)
- Shift schedules/assignments (separate module)
- Break rules with multiple break periods (future enhancement)
