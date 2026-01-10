# dashboard Specification

## Purpose
TBD - created by archiving change add-dashboard-page. Update Purpose after archive.
## Requirements
### Requirement: Dashboard Layout
The system SHALL provide a dashboard layout with a persistent sidebar navigation and top navbar for authenticated users.

#### Scenario: User views dashboard on desktop
- **GIVEN** user is authenticated
- **WHEN** user navigates to `/dashboard`
- **THEN** system displays sidebar with navigation links on the left
- **AND** system displays top navbar with user profile and notifications
- **AND** system displays main content area with dashboard widgets

#### Scenario: User views dashboard on mobile
- **GIVEN** user is authenticated on a mobile device (viewport < 1024px)
- **WHEN** user navigates to `/dashboard`
- **THEN** sidebar is hidden by default
- **AND** hamburger menu icon is displayed in the navbar
- **WHEN** user taps hamburger menu
- **THEN** sidebar slides in as a drawer overlay

#### Scenario: User collapses sidebar on desktop
- **GIVEN** user is on dashboard with expanded sidebar
- **WHEN** user clicks the collapse toggle
- **THEN** sidebar collapses to icon-only mode
- **AND** main content area expands to fill available space
- **AND** collapse state persists across page navigation

---

### Requirement: Sidebar Navigation
The system SHALL provide sidebar navigation with links to all major HCMS modules.

#### Scenario: Navigation items displayed
- **GIVEN** user is on dashboard
- **WHEN** sidebar is visible
- **THEN** system displays navigation links for:
  - Dashboard (home)
  - Shifts
  - Schedules
  - Attendance
  - Requests
  - Settings (if authorized)
- **AND** each link has an icon and label
- **AND** current page link is visually highlighted

#### Scenario: User navigates via sidebar
- **GIVEN** user is on dashboard
- **WHEN** user clicks "Attendance" in sidebar
- **THEN** system navigates to `/attendance` route
- **AND** "Attendance" link becomes highlighted

---

### Requirement: User Profile Display
The system SHALL display the authenticated user's profile information in the dashboard.

#### Scenario: User profile in navbar
- **GIVEN** user is authenticated as "Admin User" with role "ADMIN"
- **WHEN** dashboard loads
- **THEN** navbar displays user avatar (or initials if no avatar)
- **AND** navbar displays user name or dropdown trigger
- **WHEN** user clicks profile area
- **THEN** dropdown menu appears with:
  - Profile link
  - Settings link
  - Logout action

#### Scenario: Welcome message
- **GIVEN** user "Admin User" is on dashboard
- **WHEN** page loads
- **THEN** welcome card displays "Welcome back, Admin"
- **AND** displays current date

---

### Requirement: Quick Stats Widgets
The system SHALL display key statistics in animated card widgets on the dashboard.

#### Scenario: Stats cards displayed
- **GIVEN** user is on dashboard
- **WHEN** page loads
- **THEN** system displays stats cards in a grid layout:
  - Today's Attendance (hours worked or status)
  - Pending Requests (count)
  - Upcoming Shifts (next shift info)
- **AND** each card has hover animation effect

#### Scenario: Stats cards with placeholder data
- **GIVEN** backend stats API is not yet implemented
- **WHEN** dashboard loads
- **THEN** system displays placeholder/mock data in stats cards
- **AND** cards are visually complete and interactive

---

### Requirement: Recent Activity Feed
The system SHALL display a list of recent activity items on the dashboard.

#### Scenario: Activity list displayed
- **GIVEN** user is on dashboard
- **WHEN** page loads
- **THEN** system displays a "Recent Activity" section
- **AND** shows placeholder activity items (e.g., "Clocked in at 9:00 AM", "Request approved")
- **AND** each item shows timestamp and description

---

### Requirement: Quick Actions
The system SHALL provide quick action buttons for common tasks.

#### Scenario: Quick actions displayed
- **GIVEN** user is on dashboard
- **WHEN** page loads
- **THEN** system displays quick action buttons:
  - Clock In / Clock Out
  - Submit Request
  - View Schedule
- **AND** buttons are styled with icons and labels

#### Scenario: Quick action interaction (placeholder)
- **GIVEN** user is on dashboard
- **WHEN** user clicks "Submit Request" quick action
- **THEN** system navigates to `/requests/new` (or shows placeholder toast if route not implemented)

---

### Requirement: Responsive Design
The system SHALL adapt the dashboard layout for different screen sizes.

#### Scenario: Tablet breakpoint
- **GIVEN** user views dashboard on tablet (640px - 1023px)
- **THEN** sidebar displays in collapsed (icon-only) mode
- **AND** stats grid displays in 2-column layout

#### Scenario: Mobile breakpoint
- **GIVEN** user views dashboard on mobile (< 640px)
- **THEN** sidebar is hidden (drawer mode)
- **AND** stats grid displays in single-column layout
- **AND** all content is scrollable vertically

---

### Requirement: Aceternity UI Integration
The system SHALL use Aceternity UI components for visual polish and animations.

#### Scenario: Animated card hover
- **GIVEN** user is on dashboard
- **WHEN** user hovers over a stat card
- **THEN** card displays spotlight/glow animation effect
- **AND** card slightly elevates (shadow increase)

#### Scenario: Background pattern
- **GIVEN** user is on dashboard
- **WHEN** page renders
- **THEN** subtle dot grid or gradient pattern is visible in background
- **AND** pattern does not interfere with content readability

