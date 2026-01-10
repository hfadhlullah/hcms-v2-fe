import React from "react";
import { Bell, Search, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = ({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void;
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <nav
      className={cn(
        "sticky top-0 z-30",
        "bg-white dark:bg-neutral-950",
        "border-b border-neutral-200 dark:border-neutral-800"
      )}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Search Bar */}
        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
          <Search className="w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder-neutral-400"
          />
        </div>

        {/* Mobile Search Toggle */}
        <button className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors">
          <Search className="w-5 h-5" />
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors group">
            <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                  {userName}
                </div>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-t-lg"
                >
                  Profile
                </a>
                <a
                  href="/hcms-admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  HCMS Admin
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-b-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
