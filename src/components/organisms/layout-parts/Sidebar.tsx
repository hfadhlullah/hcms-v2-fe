import React from "react";
import { useLayoutStore } from "@/store";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SidebarNav = ({
  navItems,
}: {
  navItems: {
    icon: React.ReactNode;
    label: string;
    href: string;
  }[];
}) => {
  const { isSidebarOpen } = useLayoutStore();

  return (
    <nav className="space-y-2">
      {navItems.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
            "text-neutral-700 dark:text-neutral-300",
            "hover:bg-neutral-100 dark:hover:bg-neutral-900",
            "group"
          )}
        >
          <span className="flex-shrink-0 w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
            {item.icon}
          </span>
          {isSidebarOpen && (
            <span className="flex-1 text-sm font-medium">{item.label}</span>
          )}
        </a>
      ))}
    </nav>
  );
};

export const Sidebar = ({
  navItems,
}: {
  navItems: {
    icon: React.ReactNode;
    label: string;
    href: string;
  }[];
}) => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{
          width: isSidebarOpen ? 280 : 80,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "hidden md:flex flex-col",
          "bg-white dark:bg-neutral-950",
          "border-r border-neutral-200 dark:border-neutral-800",
          "h-screen sticky top-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
                HCMS
              </h1>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav navItems={navItems} />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          {isSidebarOpen && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              v1.0.0
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};
