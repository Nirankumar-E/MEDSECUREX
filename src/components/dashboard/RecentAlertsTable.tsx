'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Alert } from '@/types';
import { HeartPulse, Archive } from 'lucide-react';

const recentAlerts: Alert[] = [
  { id: 'AL-9876', timestamp: '2023-10-27 14:45:12', severity: 'Critical', description: 'Ransomware behavior detected on endpoint SRV-DB01', ttp_id: 'T1486', status: 'New', source: 'EDR', entity: 'SRV-DB01' },
  { id: 'SH-102', timestamp: '2023-10-27 14:35:10', severity: 'Critical', description: 'PII leakage detected in API response', ttp_id: 'T1530', status: 'New', source: 'Shield', entity: 'Patient Records API' },
  { id: 'AL-9875', timestamp: '2023-10-27 14:30:05', severity: 'High', description: 'Unusual outbound traffic to known C2 server', ttp_id: 'T1071', status: 'In Progress', source: 'Firewall', entity: 'PC-MKTG-05' },
  { id: 'BOX-502', timestamp: '2023-10-27 15:05:15', severity: 'High', description: 'DLP policy violation: Patient data in email', ttp_id: 'T1530', status: 'New', source: 'Box', entity: 'user@example.com' },
  { id: 'AL-9871', timestamp: '2023-10-26 20:05:33', severity: 'Critical', description: 'Data exfiltration from patient DB', ttp_id: 'T1048', status: 'New', source: 'DLP', entity: 'DB-PATIENT-RECORDS' },
];

const severityVariant: Record<Alert['severity'], 'destructive' | 'secondary' | 'default'> = {
  Critical: 'destructive',
  High: 'secondary',
  Medium: 'default',
  Low: 'default',
};

const statusColor: Record<Alert['status'], string> = {
    'New': 'bg-red-500',
    'In Progress': 'bg-yellow-500',
    'Resolved': 'bg-green-500',
    'Dismissed': 'bg-gray-500',
}

const SourceIcon = ({ source }: { source: string }) => {
  switch (source) {
    case 'Shield':
      return <HeartPulse className="h-4 w-4 text-pink-500" />;
    case 'Box':
      return <Archive className="h-4 w-4 text-orange-500" />;
    default:
      return null;
  }
}

export function RecentAlertsTable() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Recent High-Severity Alerts</CardTitle>
        <CardDescription>A summary of the latest critical and high-priority threats.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <Badge variant={severityVariant[alert.severity]}>{alert.severity}</Badge>
                </TableCell>
                <TableCell className="font-medium">{alert.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <SourceIcon source={alert.source} />
                    <span>{alert.source}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusColor[alert.status]}`} />
                    {alert.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
