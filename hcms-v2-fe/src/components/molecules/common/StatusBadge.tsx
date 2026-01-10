/**
 * StatusBadge Molecule - Maps domain statuses to badge variants
 */

import { Badge, type BadgeProps } from '@/components/atoms';

type StatusType =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'ENABLED'
    | 'DISABLED'
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'FIXED_TIME'
    | 'FLEXTIME'
    | 'WORK_DAYS'
    | 'OFF_DAYS'
    | 'FIXED'
    | 'SCHEDULED'
    | 'FREE';

const statusConfig: Record<StatusType, { variant: BadgeProps['variant']; label: string }> = {
    ACTIVE: { variant: 'success', label: 'Active' },
    INACTIVE: { variant: 'neutral', label: 'Inactive' },
    ENABLED: { variant: 'success', label: 'Enabled' },
    DISABLED: { variant: 'neutral', label: 'Disabled' },
    PENDING: { variant: 'warning', label: 'Pending' },
    APPROVED: { variant: 'success', label: 'Approved' },
    REJECTED: { variant: 'error', label: 'Rejected' },
    FIXED_TIME: { variant: 'info', label: 'Fixed-time' },
    FLEXTIME: { variant: 'purple', label: 'Flextime' },
    WORK_DAYS: { variant: 'success', label: 'Work days' },
    OFF_DAYS: { variant: 'orange', label: 'Off days' },
    // Attendance Group Types
    FIXED: { variant: 'info', label: 'Fixed Shift' },
    SCHEDULED: { variant: 'purple', label: 'Scheduled Shift' },
    FREE: { variant: 'orange', label: 'Free Shift' },
};

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
    status: StatusType | string;
    customLabel?: string;
}

function StatusBadge({ status, customLabel, ...props }: StatusBadgeProps) {
    const config = statusConfig[status as StatusType] || {
        variant: 'neutral' as const,
        label: status,
    };

    return (
        <Badge variant={config.variant} {...props}>
            {customLabel || config.label}
        </Badge>
    );
}

export { StatusBadge, type StatusType };
