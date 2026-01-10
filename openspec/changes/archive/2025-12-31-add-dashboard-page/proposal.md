# Change: Add Lark-Inspired Dashboard with Aceternity UI

## Why
The current dashboard is a placeholder stub with no functionality. Users need a polished, productivity-first dashboard that provides quick access to key HCMS features—inspired by Lark's clean, modern interface—while showcasing the system's capabilities through animated Aceternity UI components.

## What Changes
- Add new `DashboardPage` component with Lark-inspired layout
- Implement collapsible sidebar navigation with module links
- Add user profile section with avatar, name, and role
- Create quick stats widgets (attendance summary, pending requests, upcoming shifts)
- Add notification panel for recent activity
- Integrate Aceternity UI components for visual polish (animated cards, hover effects, gradients)
- Configure TailwindCSS for Aceternity component styling
- Make layout responsive (desktop-first, mobile-friendly)

## Impact
- Affected specs: `dashboard` (new capability)
- Affected code:
  - `frontend/src/pages/DashboardPage.tsx` (new)
  - `frontend/src/components/layout/Sidebar.tsx` (new)
  - `frontend/src/components/layout/Navbar.tsx` (new)
  - `frontend/src/components/dashboard/` (new widgets)
  - `frontend/src/App.tsx` (route update)
  - `frontend/package.json` (Aceternity dependencies)
  - `frontend/tailwind.config.js` (new/updated)

## Dependencies
- Aceternity UI library (`@aceternity/ui` or manual component integration)
- TailwindCSS with extended animations
- Framer Motion (for Aceternity animations)
- `clsx` and `tailwind-merge` utilities

## Design Reference
- **Lark App**: Clean sidebar with icons + labels, collapsible on mobile, workspace switcher at top
- **Aceternity Components**: Bento grid for stats, animated cards, spotlight effects, gradient borders
