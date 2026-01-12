/**
 * Route Configuration
 * 
 * Add new routes here. The app will automatically use them.
 */

import { lazy } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  Home,
  Clock,
  CheckSquare,
  Users,
} from 'lucide-react';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));

// Attendance Admin pages
const GroupSettingsPage = lazy(() => import('@/pages/GroupSettingsPage'));
const ShiftSettingsPage = lazy(() => import('@/pages/ShiftSettingsPage'));

// HCMS Admin page (will be refactored later)
const AdminPage = lazy(() => import('@/pages/AdminPage'));

export interface RouteConfig {
  path: string;
  element: ComponentType;
  isPublic?: boolean;        // If true, no authentication required
  useLayout?: boolean;       // If true, wraps with DashboardLayout
  title?: string;            // Page title for SEO/navigation
  children?: RouteConfig[];  // Nested routes (for layouts with Outlet)
}

export interface NavItem {
  icon: ReactNode;
  label: string;
  href: string;
}

/**
 * Sidebar Navigation Items
 * Add new sidebar items here
 */
export const sidebarNavItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
  { icon: <Clock className="w-5 h-5" />, label: 'Attendance', href: '/attendance' },
  { icon: <CheckSquare className="w-5 h-5" />, label: 'Requests', href: '/requests' },
  { icon: <Users className="w-5 h-5" />, label: 'Team', href: '/team' },
];

/**
 * Public Routes - No authentication required
 */
export const publicRoutes: RouteConfig[] = [
  {
    path: '/login',
    element: LoginPage,
    isPublic: true,
    useLayout: false,
    title: 'Login',
  },
];

/**
 * Protected Routes - Authentication required
 */
export const protectedRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: DashboardPage,
    useLayout: true,
    title: 'Dashboard',
  },
  {
    path: '/hcms-admin',
    element: AdminPage,
    useLayout: false,  // AdminPage has its own layout (inline for now)
    title: 'HCMS Admin',
  },
];

/**
 * Attendance Admin Routes - Uses AttendanceAdminLayout
 */
export const attendanceAdminRoutes: RouteConfig[] = [
  {
    path: 'groups',
    element: GroupSettingsPage,
    title: 'Group Settings',
  },
  {
    path: 'shifts',
    element: ShiftSettingsPage,
    title: 'Shift Settings',
  },
];

/**
 * Default redirect path
 */
export const defaultRedirect = '/dashboard';

/**
 * All routes combined
 */
export const allRoutes = [...publicRoutes, ...protectedRoutes];
