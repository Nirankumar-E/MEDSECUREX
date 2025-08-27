'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const chartData = [
    { date: 'Mon', macOS: 12, CentOS: 8, RHEL7: 5, Windows: 15, Debian: 3 },
    { date: 'Tue', macOS: 15, CentOS: 10, RHEL7: 7, Windows: 18, Debian: 5 },
    { date: 'Wed', macOS: 18, CentOS: 12, RHEL7: 9, Windows: 20, Debian: 8 },
    { date: 'Thu', macOS: 14, CentOS: 9, RHEL7: 6, Windows: 16, Debian: 4 },
    { date: 'Fri', macOS: 20, CentOS: 15, RHEL7: 11, Windows: 22, Debian: 10 },
    { date: 'Sat', macOS: 25, CentOS: 18, RHEL7: 14, Windows: 28, Debian: 12 },
    { date: 'Sun', macOS: 22, CentOS: 16, RHEL7: 12, Windows: 25, Debian: 9 },
];

const chartConfig = {
    macOS: { label: 'macOS', color: 'hsl(var(--chart-1))' },
    CentOS: { label: 'CentOS', color: 'hsl(var(--chart-2))' },
    RHEL7: { label: 'RHEL7', color: 'hsl(var(--chart-3))' },
    Windows: { label: 'Windows', color: 'hsl(var(--chart-4))' },
    Debian: { label: 'Debian', color: 'hsl(var(--chart-5))' },
};

export function AlertsEvolutionChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Alerts Evolution - Top 5 Agents</CardTitle>
        <CardDescription>Daily alert counts for the top 5 agents.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="macOS" stackId="a" fill="var(--color-macOS)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="CentOS" stackId="a" fill="var(--color-CentOS)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="RHEL7" stackId="a" fill="var(--color-RHEL7)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Windows" stackId="a" fill="var(--color-Windows)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Debian" stackId="a" fill="var(--color-Debian)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
