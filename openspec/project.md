# Project Context: difan-hrwp

## Purpose

Build an **HCMS Time & Attendance** system to manage:

- Shift definitions and policies
- Shift patterns (rotations)
- Long-range shift schedules attached to employees (e.g., 7-day pattern generated for 1 year)
- Attendance capture and daily attendance records
- Employee self-service requests (starting with **Attendance Correction**) with approval workflow
- Master data to support all of the above

Frontend will be React, backend will be **Java Spring Boot API**, with UI/UX inspired by the **Lark** app (clean, productivity-first, mobile-friendly).

## Tech Stack

- **Backend**
  - Java 21 (or Java 17 LTS)
  - Spring Boot 3.x
  - Spring Web (REST API)
  - Spring Validation (Jakarta Validation)
  - Spring Security (RBAC)
  - Spring Data JPA (Hibernate) _(or jOOQ if you prefer SQL-first)_
  - Flyway (DB migrations)
  - MySQL 8.x
  - Redis (optional, for caching + job locks)
  - OpenAPI/Swagger (springdoc-openapi)
- **Frontend**
  - React.js + TypeScript
  - TanStack Query (server state)
  - Zustand (optional local state)
  - TailwindCSS + Headless UI _(or Ant Design for enterprise component speed)_
- **Async / Jobs**
  - Spring Scheduler for simple periodic tasks
  - For heavier workloads: Quartz or a queue (Redis/RabbitMQ/Kafka) later

## Project Conventions

### Code Style

- Java style:
  - Packages by feature: `shift`, `pattern`, `schedule`, `attendance`, `request`, `masterdata`, `auth`
  - DTO suffix: `CreateShiftRequest`, `ShiftResponse`
  - Services: `ShiftService`, `ScheduleGenerationService`
  - Repos: `ShiftRepository`
- API naming:
  - REST resource-based: `/api/v1/shifts`, `/api/v1/shift-patterns`
  - Use nouns, plural
  - Pagination always for list endpoints
- Error handling:
  - Consistent error envelope: `code`, `message`, `details`, `traceId`
- Time handling:
  - Store timestamps in UTC (`Instant`)
  - Store local working date/time with timezone context when needed (`LocalDate`, `OffsetDateTime`)

### Architecture Patterns

- **Modular monolith** (recommended MVP → easy to scale later)
- **Layered + domain-focused**
  - `controller` → `service` → `repository`
  - `domain` contains business rules (pattern expansion, attendance calculation, workflow transitions)
- **Versioned configurations**
  - Shift pattern and policy changes should not break historical schedules/records
- **Audit-first**
  - Immutable audit logs for attendance, schedule changes, approvals

### Testing Strategy

- Unit tests:
  - Pattern expansion (N-day rotation to date range)
  - Night shift crossing midnight
  - Approval transitions and permissions
- Integration tests:
  - API + DB (Testcontainers for MySQL)
- Contract tests:
  - Ensure frontend expectations remain stable
- E2E (optional):
  - Playwright for key flows (request submission → approval → applied)

### Git Workflow

- Branches:
  - `main` (release), `feat/<module>-<desc>`, `fix/<module>-<desc>`
- Conventional commits:
  - `feat(schedule): generate yearly schedule from pattern`
  - `fix(attendance): handle missing checkout punch`
- PR checklist:
  - Migration included if schema changed
  - Tests updated
  - API docs updated (OpenAPI)

## Domain Context

- **Shift**
  - Defines working window (start/end), grace period, break rules, late/early thresholds, overnight support
- **Shift Pattern**
  - Repeating cycle mapping day index → shift/off-day (e.g., 7 days)
  - Versioned with effective date (pattern can evolve)
- **Shift Schedule**
  - Employee assigned to pattern for a period
  - System generates schedule instances for dates (e.g., 1 year) referencing the pattern version used
- **Attendance**
  - Raw logs (punches) → derived daily attendance record (status, late minutes, overtime, anomalies)
- **Employee Request: Attendance Correction**
  - Workflow: Draft → Submitted → Approved/Rejected → Applied
  - Approval chain (manager/HR), comments, attachments, audit
- **Master Data**
  - Org structure (Company / SBU / Division / Department)
  - Locations, holiday calendars, attendance sources/devices
  - Reasons and policies (late tolerance, overtime rules, rounding)

## Important Constraints

- **Accuracy + auditability** are mandatory (attendance/corrections are sensitive)
- **Performance** for schedule generation (batch + background)
- **Timezone-safe** design (future-proof)
- **Policy scoping** by org unit + effective dates
- **RBAC**:
  - Employee: self records + requests
  - Manager: approve team requests
  - HR/Admin: manage master data, overrides

## External Dependencies

- Optional / future:
  - SSO via OIDC (Google Workspace / Azure AD)
  - Notifications (email/Slack/WhatsApp gateway) for approvals
  - Attendance device integrations (CSV import, vendor APIs)
  - Object storage for attachments (S3-compatible)
  - Payroll/export integration endpoints
