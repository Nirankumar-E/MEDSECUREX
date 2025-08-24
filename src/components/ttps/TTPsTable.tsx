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

interface TTP {
  id: string;
  name: string;
  tactic: string;
  count: number;
  lastSeen: string;
}

const mockTTPs: TTP[] = [
  { id: 'T1059.001', name: 'PowerShell', tactic: 'Execution', count: 48, lastSeen: '2023-10-27 14:45:12' },
  { id: 'T1071.001', name: 'Web Protocols', tactic: 'Command and Control', count: 32, lastSeen: '2023-10-27 14:30:05' },
  { id: 'T1110', name: 'Brute Force', tactic: 'Credential Access', count: 25, lastSeen: '2023-10-27 13:55:41' },
  { id: 'T1530', name: 'Data from Cloud Storage Object', tactic: 'Collection', count: 18, lastSeen: '2023-10-27 12:15:00' },
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact', count: 15, lastSeen: '2023-10-26 22:10:19' },
  { id: 'T1053.005', name: 'Scheduled Task/Job: Scheduled Task', tactic: 'Execution', count: 12, lastSeen: '2023-10-26 20:05:33' },
  { id: 'T1098', name: 'Account Manipulation', tactic: 'Persistence', count: 9, lastSeen: '2023-10-26 18:45:21' },
  { id: 'T1566.001', name: 'Phishing: Spearphishing Attachment', tactic: 'Initial Access', count: 7, lastSeen: '2023-10-26 15:20:55' },
];

export function TTPsTable() {
  const [ttps] = useState<TTP[]>(mockTTPs);

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>TTPs Detected</CardTitle>
        <CardDescription>MITRE ATT&CK techniques observed in your environment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Tactic</TableHead>
              <TableHead>Detection Count</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ttps.map((ttp) => (
              <TableRow key={ttp.id}>
                <TableCell className="font-mono">{ttp.id}</TableCell>
                <TableCell className="font-medium">{ttp.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{ttp.tactic}</Badge>
                </TableCell>
                <TableCell>{ttp.count}</TableCell>
                <TableCell>{new Date(ttp.lastSeen).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
