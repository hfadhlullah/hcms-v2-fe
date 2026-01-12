/**
 * OrganizationInfoCard - Displays organization info with statistics
 */

interface OrganizationInfoCardProps {
    name?: string;
    orgId?: string;
    memberCount?: number;
    departmentCount?: number;
    primaryAdminCount?: number;
    subAdminCount?: number;
}

export function OrganizationInfoCard({
    name = "HCMS Organization",
    orgId = "ORG001",
    memberCount = 0,
    departmentCount = 0,
    primaryAdminCount = 1,
    subAdminCount = 0,
}: OrganizationInfoCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4">
                {/* Organization Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {name.charAt(0).toUpperCase()}
                </div>

                {/* Organization Info */}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
                    <p className="text-sm text-gray-500 mt-1">Organization ID : {orgId}</p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Members</p>
                    <p className="text-2xl font-semibold text-gray-900">{memberCount}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Departments</p>
                    <p className="text-2xl font-semibold text-gray-900">{departmentCount}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Primary administrators</p>
                    <p className="text-2xl font-semibold text-gray-900">{primaryAdminCount}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Sub-administrators</p>
                    <p className="text-2xl font-semibold text-gray-900">{subAdminCount}</p>
                </div>
            </div>
        </div>
    );
}
