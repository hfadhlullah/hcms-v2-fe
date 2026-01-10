# Design: Lark-Inspired Dashboard with Aceternity UI

## Overview
This design document outlines the technical architecture for the HCMS dashboard, combining Lark's productivity-first layout with Aceternity's modern animated components.

## Layout Architecture

### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────────────┐ │
│ │          │ │  Navbar (user profile, notifications, search) │ │
│ │          │ └────────────────────────────────────────────────┘ │
│ │ Sidebar  │ ┌────────────────────────────────────────────────┐ │
│ │          │ │                                                │ │
│ │ - Home   │ │  Main Content Area                             │ │
│ │ - Shifts │ │  ┌─────────┐ ┌─────────┐ ┌─────────┐           │ │
│ │ - Sched  │ │  │ Stat 1  │ │ Stat 2  │ │ Stat 3  │           │ │
│ │ - Attend │ │  └─────────┘ └─────────┘ └─────────┘           │ │
│ │ - Reqs   │ │                                                │ │
│ │          │ │  ┌───────────────────┐ ┌─────────────────────┐ │ │
│ │          │ │  │ Recent Activity   │ │ Quick Actions       │ │ │
│ │          │ │  │                   │ │                     │ │ │
│ │          │ │  └───────────────────┘ └─────────────────────┘ │ │
│ └──────────┘ └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (<1024px)
```
┌─────────────────────────────┐
│ ☰  HCMS         🔔  👤      │  ← Collapsed header with hamburger
├─────────────────────────────┤
│                             │
│  Stats (stacked vertically) │
│  ┌───────────────────────┐  │
│  │ Attendance Today      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Pending Requests      │  │
│  └───────────────────────┘  │
│                             │
│  Recent Activity            │
│  Quick Actions              │
│                             │
└─────────────────────────────┘

Sidebar: Slide-in drawer from left on hamburger click
```

## Component Hierarchy

```
App.tsx
└── DashboardLayout.tsx
    ├── Sidebar.tsx
    │   ├── SidebarHeader.tsx (logo, workspace)
    │   ├── SidebarNav.tsx (navigation items)
    │   └── SidebarFooter.tsx (user mini-profile, collapse toggle)
    ├── Navbar.tsx
    │   ├── SearchBar.tsx
    │   ├── NotificationBell.tsx
    │   └── UserMenu.tsx
    └── <Outlet /> (page content)
        └── DashboardPage.tsx
            ├── WelcomeCard.tsx
            ├── StatsGrid.tsx
            │   ├── StatCard.tsx (Aceternity animated card)
            │   ├── StatCard.tsx
            │   └── StatCard.tsx
            ├── RecentActivity.tsx
            └── QuickActions.tsx
```

## Aceternity Components to Use

### 1. Bento Grid (Stats Layout)
```tsx
// Asymmetric grid for stat cards with hover animations
<BentoGrid className="max-w-4xl mx-auto">
  <BentoGridItem title="Attendance" icon={<Clock />} />
  <BentoGridItem title="Pending" icon={<Bell />} />
  <BentoGridItem title="Shifts" icon={<Calendar />} />
</BentoGrid>
```

### 2. Animated Cards
```tsx
// Cards with spotlight hover effect
<CardSpotlight>
  <h3>Today's Attendance</h3>
  <p className="text-4xl font-bold">8h 32m</p>
</CardSpotlight>
```

### 3. Sidebar with Hover Effects
```tsx
// Navigation items with animated indicators
<SidebarLink href="/dashboard" icon={<Home />}>
  Dashboard
</SidebarLink>
```

### 4. Background Effects
```tsx
// Subtle gradient mesh or dots pattern
<BackgroundDots className="absolute inset-0 -z-10" />
```

## Color Palette (Lark-Inspired)

```css
:root {
  /* Primary - Lark Blue */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  
  /* Neutral - Clean grays */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Sidebar */
  --sidebar-bg: #1f2937;
  --sidebar-hover: #374151;
  --sidebar-active: #3b82f6;
  
  /* Accents */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
}
```

## State Management

### Sidebar State
```tsx
// Zustand store for layout state
interface LayoutStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean; // Desktop: icon-only mode
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}
```

### Dashboard Data (Future)
```tsx
// TanStack Query for dashboard stats
const { data: stats } = useQuery({
  queryKey: ['dashboard', 'stats'],
  queryFn: fetchDashboardStats,
});
```

## File Structure

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarNav.tsx
│   │   ├── Navbar.tsx
│   │   └── MobileDrawer.tsx
│   ├── dashboard/
│   │   ├── WelcomeCard.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── StatCard.tsx
│   │   ├── RecentActivity.tsx
│   │   └── QuickActions.tsx
│   └── ui/
│       ├── bento-grid.tsx      (Aceternity)
│       ├── card-spotlight.tsx  (Aceternity)
│       ├── background-dots.tsx (Aceternity)
│       └── cn.ts               (classname utility)
├── pages/
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── store/
│   ├── authStore.ts
│   └── layoutStore.ts (new)
└── styles/
    └── globals.css (Tailwind + custom vars)
```

## Dependencies to Add

```json
{
  "dependencies": {
    "framer-motion": "^11.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "@heroicons/react": "^2.1.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        spotlight: 'spotlight 2s ease .75s 1 forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: 0, transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: 1, transform: 'translate(-50%,-40%) scale(1)' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
```

## Responsive Breakpoints

| Breakpoint | Sidebar Behavior | Layout |
|------------|------------------|--------|
| < 640px (sm) | Hidden, drawer on hamburger | Single column |
| 640-1023px (md) | Collapsed (icons only) | Two column |
| ≥ 1024px (lg) | Full sidebar | Three+ column grid |

## Accessibility Considerations

- Sidebar navigation uses semantic `<nav>` with `aria-label`
- Focus management when opening/closing mobile drawer
- Keyboard navigation for all interactive elements
- Color contrast meets WCAG AA standards
- Screen reader announcements for dynamic content updates
