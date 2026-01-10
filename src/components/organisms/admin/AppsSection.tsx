/**
 * AppsSection - List of available apps with admin console links
 */

import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface App {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    iconBg: string;
    adminConsoleHref?: string;
    configureHref?: string;
}

const apps: App[] = [
    {
        id: 'attendance',
        name: 'Attendance',
        description: 'For efficient leave and attendance management',
        icon: <Clock className="w-6 h-6 text-white" />,
        iconBg: 'bg-orange-500',
        adminConsoleHref: '/attendance-admin',
    },
];

export function AppsSection() {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Apps</h3>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                {apps.map((app) => (
                    <div
                        key={app.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {/* App Icon */}
                        <div className={`w-10 h-10 ${app.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {app.icon}
                        </div>

                        {/* App Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <h4 className="text-sm font-medium text-gray-900">{app.name}</h4>
                                {app.adminConsoleHref && (
                                    <button
                                        onClick={() => navigate(app.adminConsoleHref!)}
                                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        Admin Console
                                    </button>
                                )}
                                {app.configureHref && (
                                    <button
                                        onClick={() => navigate(app.configureHref!)}
                                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        Configure
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{app.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination placeholder */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">&lt;</span>
                <span className="w-6 h-6 flex items-center justify-center text-xs bg-blue-50 text-blue-600 rounded">1</span>
                <span className="text-xs text-gray-400">&gt;</span>
            </div>
        </div>
    );
}
