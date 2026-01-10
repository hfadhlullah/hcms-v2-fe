# HCMS Frontend - React Application

Modern React frontend for the HCMS Time & Attendance System.

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ |
| Bun (recommended) or npm | Latest |

### 1. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Using npm
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

### 3. Run Development Server

```bash
# Using Bun
bun dev

# Using npm
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 📁 Project Structure

The project follows **Atomic Design** methodology:

```
frontend/
├── src/
│   ├── components/                  # UI Components
│   │   ├── atoms/                   # Basic building blocks
│   │   │   ├── forms/               # Input, Select, Checkbox, Radio, Label
│   │   │   ├── ui/                  # Button, Badge
│   │   │   └── index.ts
│   │   │
│   │   ├── molecules/               # Compound components
│   │   │   ├── forms/               # FormField, SearchInput, RadioGroup
│   │   │   ├── common/              # StatusBadge, IconButton
│   │   │   ├── dashboard/           # StatCard
│   │   │   └── index.ts
│   │   │
│   │   ├── organisms/               # Complex UI sections
│   │   │   ├── common/              # DataTable, Pagination, PageHeader, ConfirmDialog
│   │   │   ├── shifts/              # ShiftForm, ShiftSettingsView, ShiftFormPage
│   │   │   ├── attendance/          # GroupSettingsView, GroupFormPage
│   │   │   ├── dashboard/           # WelcomeCard, QuickActions, RecentActivity
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── MainLayout.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   └── ui/                      # shadcn/ui primitives
│   │       ├── dialog.tsx
│   │       ├── button.tsx
│   │       └── ...
│   │
│   ├── pages/                       # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ShiftsPage.tsx
│   │   └── AttendanceAdminPage.tsx
│   │
│   ├── api/                         # API clients
│   │   ├── authApi.ts
│   │   ├── shiftApi.ts
│   │   └── attendanceGroupApi.ts
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── index.ts
│   │
│   ├── store/                       # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── shiftStore.ts
│   │   ├── attendanceGroupStore.ts
│   │   └── index.ts
│   │
│   ├── types/                       # TypeScript types
│   │   ├── auth.ts
│   │   ├── shift.ts
│   │   └── index.ts
│   │
│   ├── config/                      # Configuration
│   │   └── menu.ts
│   │
│   ├── lib/                         # Utilities
│   │   └── utils.ts
│   │
│   ├── styles/                      # CSS files
│   │   └── LoginPage.css
│   │
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
│
├── public/                          # Static assets
├── tests/                           # Playwright E2E tests
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🛠 Tech Stack

- **Framework**: React 19
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router DOM 6
- **UI Components**: shadcn/ui + Custom Atomic Design
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Playwright

---

## 🧩 Component Architecture

### Atomic Design Hierarchy

```
Atoms → Molecules → Organisms → Pages
```

#### Atoms (Basic Elements)
```tsx
import { Button, Input, Select, Checkbox } from '@/components/atoms';
```

#### Molecules (Compound Components)
```tsx
import { FormField, SearchInput, StatusBadge, IconButton } from '@/components/molecules';
```

#### Organisms (Complex Sections)
```tsx
import { DataTable, Pagination, PageHeader, ConfirmDialog } from '@/components/organisms';
```

### Import Aliases

The project uses path aliases configured in `tsconfig.json`:

```tsx
// Instead of relative imports
import { Button } from '../../../components/atoms/ui/Button';

// Use aliases
import { Button } from '@/components/atoms';
```

---

## 📜 Available Scripts

```bash
# Development server
bun dev

# Type checking
bun run build  # Runs tsc before build

# Linting
bun run lint

# Production build
bun run build

# Preview production build
bun run preview
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Backend API URL |

### Vite Config (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 🧪 Testing

### E2E Tests with Playwright

```bash
# Install browsers
bunx playwright install

# Run tests
bun run test

# Run with UI
bunx playwright test --ui

# Run specific test
bunx playwright test login.spec.ts
```

### Test Coverage

- Login form validation
- Authentication flow
- CRUD operations for shifts
- Navigation and routing

---

## 📦 Build for Production

```bash
# Build
bun run build

# Output directory
dist/

# Preview build locally
bun run preview
```

### Deployment

The `dist/` folder contains static files ready for deployment to:
- Nginx
- Apache
- Vercel
- Netlify
- AWS S3 + CloudFront

---

## 🎨 Styling

### Tailwind CSS

Global styles in `src/index.css`:

```css
@import "tailwindcss";
```

### Component Styling

Use Tailwind classes with `cn()` utility:

```tsx
import { cn } from '@/lib/utils';

<button className={cn(
  "px-4 py-2 rounded-lg",
  variant === "primary" && "bg-blue-600 text-white",
  disabled && "opacity-50 cursor-not-allowed"
)}>
  Click me
</button>
```

---

## 🔧 Development

### Adding New Components

1. **Atoms**: Basic elements (Button, Input)
   ```
   src/components/atoms/[category]/ComponentName.tsx
   ```

2. **Molecules**: Combinations of atoms
   ```
   src/components/molecules/[category]/ComponentName.tsx
   ```

3. **Organisms**: Complex sections
   ```
   src/components/organisms/[category]/ComponentName.tsx
   ```

4. Update the category's `index.ts` to export the new component

### Adding New Pages

1. Create page in `src/pages/`
2. Add route in `src/App.tsx`
3. Add to navigation menu in `src/config/menu.ts`

### State Management

Use Zustand stores:

```tsx
// Create store
export const useMyStore = create<MyState>((set) => ({
  data: [],
  loading: false,
  fetchData: async () => {
    set({ loading: true });
    const data = await api.getData();
    set({ data, loading: false });
  },
}));

// Use in component
const { data, loading, fetchData } = useMyStore();
```

---

## 📄 License

MIT License
