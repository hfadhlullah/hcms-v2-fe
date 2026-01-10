# Design: Login Page & Auth System

## Overview

The login page is the primary user entry point. It must be:
- **Secure**: HTTPS-only, no credential leaks, rate-limited, no enumeration.
- **Accessible**: Clear error messages, mobile-responsive, keyboard-friendly.
- **Performant**: Single-page load, minimal JS, quick API response.

## Architecture

### Backend Flow

```
User submits (email/username, password) via POST /api/v1/auth/login
→ Validate input (not empty, format check)
→ Query User table by email/username
→ Compare plaintext password with hashed value (bcrypt)
→ On success:
    - Fetch user roles/permissions
    - Generate JWT (claim: userId, roles, expiresAt)
    - Return token + user metadata
→ On failure: Return 401 Unauthorized (generic message)
```

### Frontend Flow

```
User enters credentials in login form
→ Client-side validation (non-empty, email format)
→ POST /api/v1/auth/login
→ On success:
    - Store token (httpOnly cookie preferred for security)
    - Redirect to home or requested page
→ On failure:
    - Show error message (generic: "Invalid credentials")
    - Optionally display "Forgot password?" link (future)
```

## Security Considerations

1. **Password hashing**: Use bcrypt (Spring Security default) with cost ≥ 10.
2. **Rate limiting**: Max 5 failed attempts per IP per minute (Spring Security or Redis).
3. **HTTPS only**: Never transmit credentials over plain HTTP.
4. **Token lifetime**: JWT valid for 8 hours; refresh token (optional MVP) for longer sessions.
5. **Audit**: Log all login attempts (success/failure) with timestamp, IP, user agent.
6. **No enumeration**: Error message must not reveal if email exists ("Invalid credentials").

## Data Model

### User Table (new)

```sql
CREATE TABLE user (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by_id BIGINT,
  FOREIGN KEY (created_by_id) REFERENCES user(id)
);

CREATE TABLE user_role (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  role ENUM('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN') NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, role)
);
```

## API Contract

**Endpoint**: `POST /api/v1/auth/login`

**Request**:
```json
{
  "email": "john@example.com",
  "password": "secretPassword123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 42,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["EMPLOYEE"]
  },
  "expiresAt": "2025-12-31T04:00:00Z"
}
```

**Response (401 Unauthorized)**:
```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password.",
  "traceId": "abc123"
}
```

## Frontend UI Wireframe (per login.png)

- Header: HCMS logo
- Form fields:
  - Email/Username (text input)
  - Password (password input)
  - Remember me (checkbox, optional MVP)
  - Login (button, disabled while loading)
- Error zone: Displays validation or auth errors
- Footer: "Forgot password?" link (future), copyright

## Testing Strategy

- **Unit**: Password hashing, JWT generation/validation, role mapping.
- **Integration**: Login flow (DB → JWT → redirect), rate limiting, audit logs.
- **Contract**: Verify API response shape matches OpenAPI spec.
- **E2E**: Playwright test for full login → home redirect.

## Future Extensions

- Password reset flow (email link with expiring token).
- MFA (TOTP/SMS) post-login.
- SSO via OIDC (Google Workspace, Azure AD).
- Social login (Google, GitHub).
- Session timeout warning + auto-logout.
