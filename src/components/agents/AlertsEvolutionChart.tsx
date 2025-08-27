'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: '10:00', macOS: 4000, Centos: 2400, RHEL7: 1200, Windows: 800, Debian: 400 },
  { name: '11:00', macOS: 3000, Centos: 1398, RHEL7: 1100, Windows: 950, Debian: 450 },
  { name: '12:00', macOS: 2000, Centos: 9800, RHEL7: 900, Windows: 1200, Debian: 600 },
  { name: '13:00', macOS: 2780, Centos: 3908, RHEL7: 1000, Windows: 1100, Debian: 550 },
  { name: '14:00', macOS: 1890, Centos: 4800, RHEL7: 1200, Windows: 1000, Debian: 500 },
  { name: '15:00', macOS: 2390, Centos: 3800, RHEL7: 1150, Windows: 900, Debian: 480 },
  { name: '16:00', macOS: 3490, Centos: 4300, RHEL7: 1050, Windows: 1300, Debian: 620 },
];

export function AlertsEvolutionChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Alerts evolution - Top 5 agents</CardTitle>
        <CardDescription>timestamp per 30 minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend />
            <Bar dataKey="macOS" stackId="a" fill="hsl(var(--chart-1))" />
            <Bar dataKey="Centos" stackId="a" fill="hsl(var(--chart-2))" />
            <Bar dataKey="RHEL7" stackId="a" fill="hsl(var(--chart-3))" />
            <Bar dataKey="Windows" stackId="a" fill="hsl(var(--chart-4))" />
            <Bar dataKey="Debian" stackId="a" fill="hsl(var(--chart-5))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
