'use client';

import { Badge } from '@/components/ui/badge';
import type { AlertStatus, IncidentStatus } from '@/types';

interface StatusBadgeProps {
  status: AlertStatus | IncidentStatus;
}

const statusStyles: Record<AlertStatus | IncidentStatus, string> = {
  'New': 'bg-red-600 text-white border-transparent hover:bg-red-600/80',
  'Open': 'bg-red-600 text-white border-transparent hover:bg-red-600/80',
  'In Progress': 'bg-orange-500 text-white border-transparent hover:bg-orange-500/80',
  'Resolved': 'bg-green-600 text-white border-transparent hover:bg-green-600/80',
  'Dismissed': 'bg-gray-500 text-white border-transparent hover:bg-gray-500/80',
  'Closed': 'bg-gray-500 text-white border-transparent hover:bg-gray-500/80',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={statusStyles[status]}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[status].split(' ')[0]}`} />
        {status}
      </div>
    </Badge>
  );
}