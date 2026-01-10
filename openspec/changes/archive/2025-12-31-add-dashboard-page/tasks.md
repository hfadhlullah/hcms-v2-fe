# Tasks: Add Lark-Inspired Dashboard with Aceternity UI

## 1. Setup & Dependencies
- [ ] Install TailwindCSS and configure `tailwind.config.js` with custom animations
- [ ] Install Framer Motion for Aceternity animations
- [ ] Install utility libraries: `clsx`, `tailwind-merge`, `@heroicons/react`
- [ ] Create `cn()` utility function for classname merging
- [ ] Update `frontend/src/index.css` with Tailwind directives and CSS variables

## 2. Aceternity UI Components
- [ ] Create `frontend/src/components/ui/bento-grid.tsx` - animated grid layout
- [ ] Create `frontend/src/components/ui/card-spotlight.tsx` - hover spotlight effect
- [ ] Create `frontend/src/components/ui/background-dots.tsx` - subtle background pattern
- [ ] Create `frontend/src/components/ui/animated-tooltip.tsx` - for user avatars

## 3. Layout Components
- [ ] Create `frontend/src/store/layoutStore.ts` for sidebar state management
- [ ] Create `frontend/src/components/layout/DashboardLayout.tsx` - main layout wrapper
- [ ] Create `frontend/src/components/layout/Sidebar.tsx` - collapsible sidebar with nav
- [ ] Create `frontend/src/components/layout/SidebarNav.tsx` - navigation items with icons
- [ ] Create `frontend/src/components/layout/Navbar.tsx` - top bar with user menu
- [ ] Create `frontend/src/components/layout/MobileDrawer.tsx` - slide-in drawer for mobile

## 4. Dashboard Widgets
- [ ] Create `frontend/src/components/dashboard/WelcomeCard.tsx` - greeting with user name
- [ ] Create `frontend/src/components/dashboard/StatsGrid.tsx` - bento grid container
- [ ] Create `frontend/src/components/dashboard/StatCard.tsx` - individual stat with animation
- [ ] Create `frontend/src/components/dashboard/RecentActivity.tsx` - activity feed list
- [ ] Create `frontend/src/components/dashboard/QuickActions.tsx` - action button grid

## 5. Dashboard Page
- [ ] Create `frontend/src/pages/DashboardPage.tsx` - compose all widgets
- [ ] Update `frontend/src/App.tsx` to use `DashboardLayout` for protected routes
- [ ] Remove inline placeholder Dashboard component from `App.tsx`

## 6. Styling & Polish
- [ ] Add Lark-inspired color palette to Tailwind config
- [ ] Implement dark/light mode support (optional, stretch goal)
- [ ] Add smooth transitions for sidebar collapse/expand
- [ ] Test responsive breakpoints (mobile, tablet, desktop)

## 7. Validation
- [ ] Manual test: Login flow redirects to new dashboard
- [ ] Manual test: Sidebar navigation links work (placeholder pages OK)
- [ ] Manual test: Mobile drawer opens/closes correctly
- [ ] Manual test: Stat cards render with hover animations
- [ ] Verify no console errors or TypeScript issues

## Dependencies
- Task 2 depends on Task 1 (Tailwind + Framer Motion required)
- Task 3 depends on Task 2 (layout uses Aceternity components)
- Task 4 depends on Task 2 (widgets use Aceternity components)
- Task 5 depends on Tasks 3 + 4
- Task 6 can run in parallel with Task 5
- Task 7 runs after all implementation complete
