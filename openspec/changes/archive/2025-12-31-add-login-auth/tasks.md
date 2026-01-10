# Tasks: Add Login Page with Credential-Based Auth

## Phase 1: Backend Setup (No external dependencies)

### Task 1: Create User and UserRole domain entities + JPA repositories

**Description**: Define `User` entity (id, email, username, passwordHash, firstName, lastName, status) and `UserRole` entity (userId, role enum) with proper JPA annotations. Create `UserRepository` and `UserRoleRepository`.

**Acceptance Criteria**:
- Entities are in `com.example.hcms.auth.domain` package
- User has unique constraints on email and username
- UserRole has composite unique key (user_id, role)
- Repositories extend JpaRepository
- Entities include audit fields: createdAt, updatedAt, createdById

**Validation**: Unit test: entity constraints, repo findByEmail queries

**Estimate**: 1-2 hours

---

### Task 2: Create Flyway migration for User and UserRole tables

**Description**: Write initial migration `V001__init_auth_user_tables.sql` to create User and UserRole tables with columns, indexes, foreign keys.

**Acceptance Criteria**:
- Migration is idempotent (IF NOT EXISTS)
- Indexes on email, username, user_id for performance
- Foreign key from user_role.user_id to user.id with ON DELETE CASCADE
- Audit columns (created_at, updated_at) with defaults

**Validation**: Integration test: migration runs without error, schema matches design

**Estimate**: 30-45 minutes

---

### Task 3: Create AuthService with login business logic

**Description**: Implement `AuthService.login(email, password)` that:
1. Finds user by email
2. Compares plaintext password with bcrypt hash
3. Loads user roles
4. Generates JWT token
5. Logs audit entry

**Acceptance Criteria**:
- Uses Spring Security's `PasswordEncoder` (BCrypt, cost 10+)
- Returns `LoginResponse` DTO with token, user metadata, expiresAt
- Throws `InvalidCredentialsException` on mismatch (generic message)
- Calls AuditService to log attempt
- No credentials logged

**Validation**: Unit test with mocked UserRepository; test password mismatch and success paths

**Estimate**: 2-3 hours

---

### Task 4: Create JWT token generation and validation logic

**Description**: Implement JWT provider class with:
- `generateToken(userId, roles)` → returns signed token string
- `validateToken(token)` → returns claims or throws exception
- Token lifetime: 8 hours

**Acceptance Criteria**:
- Uses `io.jsonwebtoken:jjwt` library
- Secret key read from `spring.security.jwt.secret` property
- Token includes userId, roles claims
- Validation checks signature, expiry
- Claims extraction available for downstream filters

**Validation**: Unit test: token generation, validation, expiry, signature mismatch

**Estimate**: 1-2 hours

---

### Task 5: Create rate limiting interceptor / filter

**Description**: Implement a login rate limiter that tracks failed attempts by IP, blocks after 5 failures in 60s.

**Acceptance Criteria**:
- Uses Redis or in-memory cache (ConcurrentHashMap for MVP)
- Counter key: `login_attempts:<ip_address>`
- Reset counter on successful login
- Returns 429 Too Many Requests with retry-after header
- Logs rate-limit blocks

**Validation**: Integration test: 5 failures pass, 6th fails with 429

**Estimate**: 1-2 hours

---

### Task 6: Create REST controller endpoint POST /api/v1/auth/login

**Description**: Implement `AuthController.login(LoginRequest)` that calls AuthService, returns LoginResponse or error.

**Acceptance Criteria**:
- Accepts JSON: { email, password }
- Returns 200 OK with token, user, expiresAt
- Returns 400 on missing/invalid fields
- Returns 401 on invalid credentials
- Returns 429 on rate limit
- Follows error envelope: code, message, traceId
- Includes OpenAPI annotations for Swagger documentation

**Validation**: Integration test: 3 paths (success, 401, 429)

**Estimate**: 1-2 hours

---

### Task 7: Create audit logging service for login events

**Description**: Implement `AuthAuditService.logLoginAttempt(email, success, ip, userAgent, reason)` to persist audit records.

**Acceptance Criteria**:
- Creates `LoginAudit` entity with timestamp, email, success flag, ip, userAgent, reason, user_id (if success)
- Queryable by HR/Admin endpoint (not in this proposal, but schema ready)
- No sensitive data logged (password, token)

**Validation**: Unit test: audit record creation; integration test: query by email

**Estimate**: 1 hour

---

## Phase 2: Frontend Setup (Parallel with Phase 1)

### Task 8: Create LoginPage React component with form

**Description**: Implement `/src/pages/LoginPage.tsx` with:
- Email/username input, password input, submit button
- Client-side validation (non-empty, email format)
- Loading state during API call
- Error message display
- Remember me checkbox (optional MVP)
- Responsive layout (Tailwind CSS)

**Acceptance Criteria**:
- Form validates before submit
- Disabled button while loading
- Error message cleared on input change
- Password field cleared on validation error
- Mobile responsive (320px+)
- Matches login.png design mockup

**Validation**: Visual inspection, Playwright E2E test for form interaction

**Estimate**: 2-3 hours

---

### Task 9: Create API client helper for /api/v1/auth/login

**Description**: Implement `authApi.ts` with `login(email, password)` function using fetch or axios.

**Acceptance Criteria**:
- Calls POST `/api/v1/auth/login` with credentials
- Returns typed `LoginResponse`
- Throws typed errors for 401, 429, 5xx
- No credentials logged in error handlers
- Uses environment-based API URL

**Validation**: Unit test with mocked fetch; integration test against running backend

**Estimate**: 1 hour

---

### Task 10: Create secure token storage mechanism

**Description**: Implement token storage (httpOnly cookie OR localStorage) and retrieval.

**Acceptance Criteria**:
- Token stored via HTTP Set-Cookie with httpOnly, Secure, SameSite flags (preferred)
- OR localStorage with secure warning in design doc if chosen
- `getToken()` helper reads from chosen storage
- `clearToken()` on logout
- Token passed in Authorization header (Bearer <token>) on all subsequent requests

**Validation**: Browser dev tools inspection; interceptor test

**Estimate**: 1 hour

---

### Task 11: Create auth state management (Zustand or Context)

**Description**: Implement `authStore.ts` (Zustand) or `AuthContext.tsx` with:
- `isLoggedIn`, `user`, `token`, `error` state
- `login(email, password)` action
- `logout()` action
- Hydrate from storage on app load

**Acceptance Criteria**:
- Zustand store or React Context with clean API
- State persists across page reload
- Logout clears token and state
- Loading state managed
- Can be consumed by components via hooks

**Validation**: Unit test: state transitions; component integration test

**Estimate**: 1-2 hours

---

### Task 12: Create route protection / PrivateRoute component

**Description**: Implement `PrivateRoute` wrapper that redirects unauthenticated users to login.

**Acceptance Criteria**:
- Checks `isLoggedIn` from auth store
- Redirects to `/login` if not authenticated
- Passes authenticated routes to children
- Preserves requested URL for post-login redirect

**Validation**: Playwright test: attempt to visit protected route → redirected to login

**Estimate**: 45 minutes

---

### Task 13: Integrate token into all API requests

**Description**: Add HTTP interceptor / middleware to attach JWT token to all API calls.

**Acceptance Criteria**:
- Reads token from storage
- Adds `Authorization: Bearer <token>` header to requests
- On 401 response, triggers logout + redirect to login
- Does not re-send stale tokens

**Validation**: Integration test: API calls include auth header; 401 triggers logout

**Estimate**: 1 hour

---

## Phase 3: Integration & Testing

### Task 14: Write integration tests for login flow (backend + frontend)

**Description**: Playwright E2E test: user navigates to login, enters credentials, submits, lands on dashboard.

**Acceptance Criteria**:
- Starts with fresh DB (seeded with test user)
- Navigates to `/login`
- Fills form, submits
- Waits for dashboard load
- Checks token in cookies/localStorage
- Subsequent API calls succeed

**Validation**: Test runs against live app (local server)

**Estimate**: 2 hours

---

### Task 15: Write unit tests for AuthService and JWT logic

**Description**: Comprehensive unit tests for password hashing, JWT generation, validation, edge cases.

**Acceptance Criteria**:
- Test password mismatch
- Test token expiry
- Test invalid signature
- Test bcrypt cost ≥ 10
- All paths covered (coverage ≥ 90%)

**Validation**: Test suite passes; coverage report

**Estimate**: 2 hours

---

### Task 16: Document API in OpenAPI (Swagger)

**Description**: Add OpenAPI annotations to AuthController, generate spec.

**Acceptance Criteria**:
- POST /api/v1/auth/login documented with request/response schemas
- Error responses documented (400, 401, 429, 500)
- Swagger UI displays correct schema
- Spec validates against OpenAPI 3.0 standard

**Validation**: Visit `/swagger-ui.html`, inspect generated JSON

**Estimate**: 1 hour

---

### Task 17: Load testing and security review

**Description**: Verify rate limiting works under load; review password handling, HTTPS enforcement.

**Acceptance Criteria**:
- Rate limiting blocks after 5 failures under load test (Apache JMeter)
- HTTPS is enforced (no fallback to HTTP in production)
- Password never logged or exposed in errors
- Token is signed correctly and validated

**Validation**: Load test report; code review checklist

**Estimate**: 2 hours

---

## Dependencies & Sequencing

- **Phase 1 & 2 can run in parallel** (backend and frontend are independent)
- **Task 1 → Task 2** (entities needed for migration)
- **Task 2 → Task 3** (schema needed for AuthService)
- **Task 3 → Task 6** (business logic needed for controller)
- **Task 4 → Task 3 & Task 13** (JWT provider needed by service and interceptor)
- **Task 5 → Task 6** (rate limiter needed by controller)
- **Task 8 → Task 12 & Task 13** (form uses auth state and interceptor)
- **Task 14 & 15 & 16 & 17** (testing/docs, can start after individual tasks, run in parallel)

## Parallel Workstreams

**Backend Team (Tasks 1–7, 14–17)**
**Frontend Team (Tasks 8–13, 14)**

---

## Acceptance & Handoff

All tasks marked complete when:
- ✅ Integration tests pass (login flow end-to-end)
- ✅ OpenAPI spec is documented and verified
- ✅ Rate limiting confirmed under load
- ✅ Security review checklist signed off
- ✅ Password handling audit logged
