/**
 * AdminHeader - Header for the HCMS Admin console
 */

import { Search, Bell, HelpCircle, Grid3X3 } from 'lucide-react';

interface AdminHeaderProps {
    userName?: string;
}

export function AdminHeader({ userName = 'Admin' }: AdminHeaderProps) {
    return (
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            {/* Left side */}
            <div className="flex items-center gap-4">
                {/* Logo/Title */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <span className="font-semibold text-gray-900">HCMS Admin</span>
                </div>

                {/* Organization Management Button */}
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors">
                    Organization Management
                </button>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-lg mx-8">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search features, navigation, organization data, and or..."
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Grid3X3 className="w-5 h-5 text-gray-500" />
                </button>

                {/* User avatar */}
                <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700">{userName}</span>
                </button>
            </div>
        </header>
    );
}
