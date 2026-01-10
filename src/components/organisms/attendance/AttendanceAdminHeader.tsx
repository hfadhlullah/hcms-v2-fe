import { ArrowLeft, Settings, HelpCircle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AttendanceAdminHeader() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/hcms-admin');
    };

    return (
        <header className="bg-orange-500 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={handleBack}
                    className="p-1 hover:bg-orange-600 rounded transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                </div>
                <span className="font-semibold text-lg">Attendance Admin</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm hover:bg-orange-600 px-3 py-1.5 rounded transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    Help Center
                </button>
                <button className="flex items-center gap-2 text-sm hover:bg-orange-600 px-3 py-1.5 rounded transition-colors">
                    <History className="w-4 h-4" />
                    Update History
                </button>
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
        </header>
    );
}
