
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Defs, LinearGradient, Stop } from 'recharts';

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
  const [activeBar, setActiveBar] = useState<string | null>(null);

  const getGlowFilter = (barKey: string) => {
    if (activeBar === barKey) {
      const color = chartConfig[barKey as keyof typeof chartConfig].color;
      return `drop-shadow(0 0 5px ${color})`;
    }
    return undefined;
  };

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Alerts Evolution – Top 5 Agents</CardTitle>
        <CardDescription>Alert counts over the last week for each agent.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="grad4" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="grad5" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="SRV-DB01" stackId="a" fill="url(#grad1)" strokeWidth={1} style={{ transition: 'all 0.2s ease-in-out', filter: getGlowFilter('SRV-DB01') }} onMouseOver={() => setActiveBar('SRV-DB01')} onMouseOut={() => setActiveBar(null)} />
            <Bar dataKey="PC-MKTG-05" stackId="a" fill="url(#grad2)" strokeWidth={1} style={{ transition: 'all 0.2s ease-in-out', filter: getGlowFilter('PC-MKTG-05') }} onMouseOver={() => setActiveBar('PC-MKTG-05')} onMouseOut={() => setActiveBar(null)} />
            <Bar dataKey="SRV-WEB02" stackId="a" fill="url(#grad3)" strokeWidth={1} style={{ transition: 'all 0.2s ease-in-out', filter: getGlowFilter('SRV-WEB02') }} onMouseOver={() => setActiveBar('SRV-WEB02')} onMouseOut={() => setActiveBar(null)} />
            <Bar dataKey="DB-PATIENTS" stackId="a" fill="url(#grad4)" strokeWidth={1} style={{ transition: 'all 0.2s ease-in-out', filter: getGlowFilter('DB-PATIENTS') }} onMouseOver={() => setActiveBar('DB-PATIENTS')} onMouseOut={() => setActiveBar(null)} />
            <Bar dataKey="SRV-APP03" stackId="a" fill="url(#grad5)" strokeWidth={1} style={{ transition: 'all 0.2s ease-in-out', filter: getGlowFilter('SRV-APP03') }} onMouseOver={() => setActiveBar('SRV-APP03')} onMouseOut={() => setActiveBar(null)} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
