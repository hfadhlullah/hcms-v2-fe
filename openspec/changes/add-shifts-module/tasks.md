# Tasks: Add Shifts Module

## 1. Database & Entity Setup
- [ ] Create Flyway migration `V002__create_shifts_table.sql` with all columns
- [ ] Create `Shift` JPA entity in `shift/domain/Shift.java`
- [ ] Create `ShiftStatus` enum (ACTIVE, INACTIVE)
- [ ] Create `ShiftRepository` with JPA repository interface

## 2. Backend DTOs
- [ ] Create `CreateShiftRequest` DTO with validation annotations
- [ ] Create `UpdateShiftRequest` DTO
- [ ] Create `ShiftResponse` DTO
- [ ] Create `ShiftListResponse` for paginated results

## 3. Backend Service Layer
- [ ] Create `ShiftService` interface
- [ ] Implement `ShiftServiceImpl` with CRUD operations
- [ ] Add working hours calculation logic (handle overnight shifts)
- [ ] Add duplicate code validation
- [ ] Add audit logging for mutations

## 4. Backend Controller
- [ ] Create `ShiftController` with REST endpoints
- [ ] Implement `GET /api/v1/shifts` with pagination & filtering
- [ ] Implement `GET /api/v1/shifts/{id}`
- [ ] Implement `POST /api/v1/shifts`
- [ ] Implement `PUT /api/v1/shifts/{id}`
- [ ] Implement `DELETE /api/v1/shifts/{id}` (soft delete)
- [ ] Add OpenAPI annotations for documentation

## 5. Backend Security
- [ ] Configure endpoint authorization in `WebSecurityConfig`
- [ ] Add role-based access (view: all authenticated, mutate: HR_ADMIN/ADMIN)

## 6. Backend Exception Handling
- [ ] Create `ShiftNotFoundException` exception
- [ ] Create `DuplicateShiftCodeException` exception
- [ ] Add handlers in global exception handler

## 7. Frontend Types & API
- [ ] Create `frontend/src/types/shift.ts` with TypeScript interfaces
- [ ] Create `frontend/src/api/shiftsApi.ts` with API client functions
- [ ] Add error handling for API responses

## 8. Frontend Components
- [ ] Create `ShiftList.tsx` - table component with sorting
- [ ] Create `ShiftForm.tsx` - form with validation
- [ ] Create `ShiftFormModal.tsx` - modal wrapper
- [ ] Create `ShiftDeleteDialog.tsx` - confirmation dialog
- [ ] Create `ShiftFilters.tsx` - search and status filter

## 9. Frontend Page
- [ ] Create `ShiftsPage.tsx` - main page composing components
- [ ] Add loading states and error handling
- [ ] Add empty state when no shifts exist
- [ ] Implement pagination controls

## 10. Frontend Routing
- [ ] Update `App.tsx` to add `/shifts` route with `ShiftsPage`
- [ ] Wrap route in `PrivateRoute` and `DashboardLayout`

## 11. Backend Tests
- [ ] Write unit tests for `ShiftService` (CRUD, validation, overnight calc)
- [ ] Write integration tests for `ShiftController` endpoints
- [ ] Test authorization rules

## 12. Validation & Polish
- [ ] Manual test: Create shift with all fields
- [ ] Manual test: Edit existing shift
- [ ] Manual test: Delete shift (verify soft delete)
- [ ] Manual test: Overnight shift time display
- [ ] Manual test: Pagination and filtering
- [ ] Manual test: Authorization (non-admin cannot create)
- [ ] Verify OpenAPI docs at `/swagger-ui.html`

## Dependencies
- Tasks 1-6 (backend) can be done in sequence
- Tasks 7-10 (frontend) depend on Task 4 (API ready)
- Task 11 can run parallel with frontend tasks
- Task 12 runs after all implementation complete
