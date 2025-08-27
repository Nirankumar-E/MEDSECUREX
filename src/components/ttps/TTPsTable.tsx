'use client';

import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof TTP; direction: 'ascending' | 'descending' } | null>({ key: 'count', direction: 'descending' });

  const filteredAndSortedTTPs = useMemo(() => {
    let filtered = ttps.filter(ttp =>
      ttp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ttp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ttp.tactic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [ttps, searchTerm, sortConfig]);

  const requestSort = (key: keyof TTP) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">TTPs Detected</CardTitle>
        <CardDescription className="text-center">MITRE ATT&CK techniques observed in your environment.</CardDescription>
      </CardHeader>
      <div className="py-4 px-6">
        <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by ID, Name, or Tactic..."
              className="pl-10 rounded-2xl border-border focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0 transition duration-200 ease-in-out"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell text-center">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell text-center">Tactic</TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => requestSort('count')}>
                  Count
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell text-center">
                <Button variant="ghost" onClick={() => requestSort('lastSeen')}>
                  Last Seen
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTTPs.map((ttp) => (
              <TableRow key={ttp.id}>
                <TableCell className="font-mono hidden md:table-cell text-center">{ttp.id}</TableCell>
                <TableCell className="font-medium">{ttp.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-center">
                  <Badge variant="outline">{ttp.tactic}</Badge>
                </TableCell>
                <TableCell className="text-center">{ttp.count}</TableCell>
                <TableCell className="hidden lg:table-cell text-center">{new Date(ttp.lastSeen).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
