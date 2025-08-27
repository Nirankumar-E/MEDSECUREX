'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { StatusBadge } from '../ui/StatusBadge';
import type { Incident, IncidentSeverity, IncidentStatus } from '@/types';


const mockIncidents: Incident[] = [
  { id: 'INC-001', title: 'Ransomware attack on SRV-DB01', status: 'In Progress', severity: 'Critical', assignee: 'Dr. Alex Chen', created: '2023-10-27 15:00:00' },
  { id: 'INC-002', title: 'Data exfiltration from patient records DB', status: 'Open', severity: 'Critical', assignee: 'Unassigned', created: '2023-10-27 10:00:00' },
  { id: 'INC-003', title: 'C2 communication from PC-MKTG-05', status: 'In Progress', severity: 'High', assignee: 'Ben Carter', created: '2023-10-27 09:00:00' },
  { id: 'INC-004', title: 'Brute-force attempts on admin account', status: 'Resolved', severity: 'High', assignee: 'Ben Carter', created: '2023-10-27 08:00:00' },
  { id: 'INC-005', title: 'Suspicious PowerShell execution on SRV-WEB02', status: 'Resolved', severity: 'High', assignee: 'Casey Day', created: '2023-10-26 23:00:00' },
  { id: 'INC-006', title: 'Suspicious scheduled task on SRV-APP03', status: 'Resolved', severity: 'Medium', assignee: 'Casey Day', created: '2023-10-26 18:00:00' },
  { id: 'INC-007', title: 'Phishing email campaign detected', status: 'Closed', severity: 'Medium', assignee: 'Ben Carter', created: '2023-10-26 12:00:00' },
  { id: 'INC-008', title: 'User added to privileged group', status: 'Closed', severity: 'Low', assignee: 'Casey Day', created: '2023-10-26 11:00:00' },
    { id: 'INC-009', title: 'Anomalous API usage for user_123', status: 'Open', severity: 'High', assignee: 'Unassigned', created: '2023-10-27 14:40:00' },
  { id: 'INC-010', title: 'PII leakage in API response', status: 'In Progress', severity: 'Critical', assignee: 'Dr. Alex Chen', created: '2023-10-27 14:35:10' },
  { id: 'INC-011', title: 'Excessive 4xx errors from client IP', status: 'In Progress', severity: 'Medium', assignee: 'Ben Carter', created: '2023-10-27 13:50:25' },
  { id: 'INC-012', title: 'Potential API scraping activity', status: 'Resolved', severity: 'High', assignee: 'Casey Day', created: '2023-10-26 21:30:00' },
];

const severityStyles: Record<IncidentSeverity, string> = {
  Critical: 'bg-purple-700 text-white border-transparent',
  High: 'bg-red-600 text-white border-transparent',
  Medium: 'bg-orange-500 text-white border-transparent',
  Low: 'bg-yellow-400 text-black border-transparent',
};

export function IncidentsTable() {
  const [incidents] = useState<Incident[]>(mockIncidents);

  return (
    <Card className="rounded-2xl shadow-lg">
        <CardHeader>
            <CardTitle>Incidents</CardTitle>
            <CardDescription>All open and historical security incidents.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                    <TableCell className="font-mono">{incident.id}</TableCell>
                    <TableCell className="font-medium">{incident.title}</TableCell>
                    <TableCell>
                        <StatusBadge status={incident.status} />
                    </TableCell>
                    <TableCell>
                        <Badge className={severityStyles[incident.severity]}>{incident.severity}</Badge>
                    </TableCell>
                    <TableCell>{incident.assignee}</TableCell>
                    <TableCell>{new Date(incident.created).toLocaleString()}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
