'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const chartData = [
  { date: 'Mon', 'SRV-DB01': 40, 'PC-MKTG-05': 24, 'SRV-WEB02': 22, 'DB-PATIENTS': 10, 'SRV-APP03': 13 },
  { date: 'Tue', 'SRV-DB01': 30, 'PC-MKTG-05': 13, 'SRV-WEB02': 35, 'DB-PATIENTS': 20, 'SRV-APP03': 18 },
  { date: 'Wed', 'SRV-DB01': 20, 'PC-MKTG-05': 58, 'SRV-WEB02': 12, 'DB-PATIENTS': 15, 'SRV-APP03': 22 },
  { date: 'Thu', 'SRV-DB01': 27, 'PC-MKTG-05': 39, 'SRV-WEB02': 45, 'DB-PATIENTS': 25, 'SRV-APP03': 10 },
  { date: 'Fri', 'SRV-DB01': 18, 'PC-MKTG-05': 48, 'SRV-WEB02': 29, 'DB-PATIENTS': 30, 'SRV-APP03': 15 },
  { date: 'Sat', 'SRV-DB01': 23, 'PC-MKTG-05': 38, 'SRV-WEB02': 15, 'DB-PATIENTS': 8, 'SRV-APP03': 12 },
  { date: 'Sun', 'SRV-DB01': 34, 'PC-MKTG-05': 43, 'SRV-WEB02': 25, 'DB-PATIENTS': 18, 'SRV-APP03': 9 },
];

const chartConfig = {
  'SRV-DB01': { label: 'SRV-DB01', color: 'hsl(var(--chart-1))' },
  'PC-MKTG-05': { label: 'PC-MKTG-05', color: 'hsl(var(--chart-2))' },
  'SRV-WEB02': { label: 'SRV-WEB02', color: 'hsl(var(--chart-3))' },
  'DB-PATIENTS': { label: 'DB-PATIENTS', color: 'hsl(var(--chart-4))' },
  'SRV-APP03': { label: 'SRV-APP03', color: 'hsl(var(--chart-5))' },
};

export function AlertsEvolutionChart() {
  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Alerts Evolution – Top 5 Agents</CardTitle>
        <CardDescription>Alert counts over the last week for each agent.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="SRV-DB01" stackId="a" fill="var(--color-SRV-DB01)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="PC-MKTG-05" stackId="a" fill="var(--color-PC-MKTG-05)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="SRV-WEB02" stackId="a" fill="var(--color-SRV-WEB02)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="DB-PATIENTS" stackId="a" fill="var(--color-DB-PATIENTS)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="SRV-APP03" stackId="a" fill="var(--color-SRV-APP03)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
