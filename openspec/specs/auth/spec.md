# auth Specification

## Purpose
TBD - created by archiving change add-login-auth. Update Purpose after archive.
## Requirements
### Requirement: User credential authentication via REST API

The system SHALL enable users to authenticate by submitting email/username and password to a REST endpoint, receive a JWT token, and access protected resources.

**Acceptance Criteria**:
1. `POST /api/v1/auth/login` accepts JSON with `email` and `password`.
2. On valid credentials, returns 200 OK with JWT token and user metadata (id, email, roles, expiresAt).
3. On invalid credentials, returns 401 Unauthorized with generic error message.
4. On malformed input (missing field, empty password), returns 400 Bad Request with validation error.
5. Password is hashed with bcrypt (cost ≥ 10); plaintext never stored.
6. Token is signed with HS256 or RS256; contains claims: userId, roles, expiresAt.

#### Scenario: Employee logs in with valid email and password

**Given** an employee with email `alice@company.com` and bcrypt-hashed password `password123`
**When** POST `/api/v1/auth/login` with `{"email": "alice@company.com", "password": "password123"}`
**Then** response is 200 OK with token, user details, and expiry ≥ 8 hours from now

#### Scenario: User attempts login with wrong password

**Given** an employee with email `alice@company.com`
**When** POST `/api/v1/auth/login` with `{"email": "alice@company.com", "password": "wrongPassword"}`
**Then** response is 401 Unauthorized with message "Invalid email or password."
**And** no token is issued

#### Scenario: User attempts login with non-existent email

**Given** no user with email `unknown@company.com`
**When** POST `/api/v1/auth/login` with `{"email": "unknown@company.com", "password": "anyPassword"}`
**Then** response is 401 Unauthorized with message "Invalid email or password."
**And** no token is issued (does not reveal email non-existence)

### Requirement: Login form on frontend

The system SHALL provide a React-based login form that validates input, submits credentials, handles errors, and redirects on success.

**Acceptance Criteria**:
1. Form displays email/username input, password input, submit button.
2. Client-side validation: email format, non-empty password, before submission.
3. On submit, sends POST `/api/v1/auth/login` with credentials.
4. On 200 response, stores token securely (httpOnly cookie or localStorage) and redirects to `/dashboard` or requested page.
5. On error (401, 400, 500), displays error message without re-querying backend.
6. Loading state (disabled button, spinner) shown during API call.
7. Form is responsive (mobile-friendly), matches Lark aesthetic (clean, minimal).

#### Scenario: Employee fills form and logs in successfully

**Given** the login page `/login`
**When** user enters `alice@company.com` in email, `password123` in password, and clicks "Login"
**Then** form submits, token is stored, page redirects to `/dashboard`
**And** subsequent API calls include token in Authorization header

#### Scenario: Employee submits form with empty password

**Given** the login page `/login`
**When** user enters `alice@company.com` in email, leaves password empty, and clicks "Login"
**Then** client-side validation shows error "Password required"
**And** no API call is made

#### Scenario: Employee sees error after failed login

**Given** the login page `/login`
**When** user enters `alice@company.com` and wrong password, clicks "Login", receives 401
**Then** error message "Invalid email or password." is displayed
**And** form remains on page for retry
**And** password field is cleared

### Requirement: Rate limiting and audit logging

The system SHALL prevent brute-force attacks by rate-limiting login attempts and maintain audit records.

**Acceptance Criteria**:
1. Max 5 failed login attempts per IP address per minute.
2. On 6th attempt within window, return 429 Too Many Requests.
3. Successful login attempts are logged with timestamp, email, IP, user agent.
4. Failed login attempts are logged with timestamp, attempted email, IP, reason (password mismatch, user not found, rate limit).
5. Logs are queryable by HR/Admin for security audits.

#### Scenario: Attacker attempts 6 logins from same IP in 1 minute

**Given** 5 failed login attempts from IP `192.168.1.100` in past 60 seconds
**When** 6th login attempt from same IP
**Then** response is 429 Too Many Requests with message "Too many attempts, try again in X seconds"
**And** no auth lookup is performed (short-circuit)

#### Scenario: Successful login is recorded

**Given** user logs in successfully
**When** JWT is issued
**Then** audit log entry is created with: timestamp, user_id, success=true, ip_address, user_agent

### Requirement: JWT token management

JWT tokens SHALL be issued, validated, and expire appropriately.

**Acceptance Criteria**:
1. Token is issued with `expiresAt` claim set to 8 hours from login time.
2. Token includes `userId` and `roles` claims.
3. Token is signed with a secret key (HS256) or public key (RS256).
4. Protected endpoints validate token signature and expiry; return 401 if invalid or expired.
5. Token can be revoked (optional MVP) via logout endpoint.

#### Scenario: Client uses token to access protected endpoint

**Given** token from successful login with userId=42, roles=[EMPLOYEE], expiry=8h from now
**When** GET `/api/v1/me` with Authorization header `Bearer <token>`
**Then** response is 200 OK with user details
**And** no new login required

#### Scenario: Client uses expired token

**Given** token issued 9 hours ago (now expired)
**When** GET `/api/v1/me` with expired token
**Then** response is 401 Unauthorized with message "Token expired"
**And** client redirects to login

