/**
 * App.tsx - Main React application component
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { setupApiInterceptor } from '@/utils';
import { PrivateRoute } from '@/components/organisms';
import { DashboardLayout, AttendanceAdminLayout } from '@/layouts';
import { publicRoutes, protectedRoutes, attendanceAdminRoutes, defaultRedirect } from '@/routes';

// Initialize API interceptor immediately on app load
setupApiInterceptor();

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-gray-500">Loading...</div>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.element />}
            />
          ))}

          {/* Protected Routes */}
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  {route.useLayout ? (
                    <DashboardLayout>
                      <route.element />
                    </DashboardLayout>
                  ) : (
                    <route.element />
                  )}
                </PrivateRoute>
              }
            />
          ))}

          {/* Attendance Admin Routes - Nested under AttendanceAdminLayout */}
          <Route
            path="/attendance-admin"
            element={
              <PrivateRoute>
                <AttendanceAdminLayout />
              </PrivateRoute>
            }
          >
            {/* Default redirect to groups */}
            <Route index element={<Navigate to="groups" replace />} />
            {/* Child routes */}
            {attendanceAdminRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
          </Route>

          {/* Default redirects */}
          <Route path="/" element={<Navigate to={defaultRedirect} replace />} />
          <Route path="*" element={<Navigate to={defaultRedirect} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
