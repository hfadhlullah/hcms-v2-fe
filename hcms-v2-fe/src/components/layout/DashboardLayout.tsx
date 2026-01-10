import React from "react";
import { useAuth } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { Sidebar, Navbar } from "@/components/layout";
import { sidebarNavItems } from "@/routes";
import { cn } from "@/lib/utils";

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={cn("flex h-screen bg-white dark:bg-neutral-950")}>
      {/* Sidebar */}
      <Sidebar navItems={sidebarNavItems} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          userName={user?.email || "User"}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
