# Change: Add Login Page with Credential-Based Auth

## Summary

Implement a credential-based login page as the entry point to the HCMS system. Users (employees, managers, HR admins) authenticate with username/email and password. This is a foundational feature required before other protected resources can be accessed.

## Why

- **MVP requirement**: System needs a secure authentication mechanism to protect employee data (attendance records, personal schedules, requests).
- **RBAC foundation**: Login is the first checkpoint; roles (Employee, Manager, HR) are fetched post-authentication.
- **User-first design**: Clean, mobile-friendly login inspired by the Lark app aesthetic.

## What Changes

- **New REST endpoint**: `POST /api/v1/auth/login` to accept credentials and return JWT token.
- **Frontend login page**: React-based form with email/username, password fields, error handling, and remember-me option.
- **Session management**: JWT tokens stored securely (httpOnly cookie or localStorage); logout clears session.
- **Capability**: `auth` (new) — covers login, session, and future MFA/SSO extensions.

## Impact

- **Scope**: Auth module only (no backend changes to existing modules).
- **Risk**: Low—credential validation is isolated; no schema changes to existing tables.
- **Future**: Sets foundation for OIDC/SSO, password reset, MFA.

## Design Reference

See [login.png](../../login.png) for UI mockup and layout.

## Next Steps

1. Approve proposal and design.
2. Create spec deltas under `specs/auth/`.
3. Implement backend endpoints, database schema (users table), and frontend form.
4. Write unit and integration tests.
5. Validate against OpenAPI contract.
