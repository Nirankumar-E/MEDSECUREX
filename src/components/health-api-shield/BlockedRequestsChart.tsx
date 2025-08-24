'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, CartesianGrid, XAxis } from 'recharts';

const chartData = [
  { time: '14:00', blocked: 12 },
  { time: '14:05', blocked: 15 },
  { time: '14:10', blocked: 8 },
  { time: '14:15', blocked: 18 },
  { time: '14:20', blocked: 25 },
  { time: '14:25', blocked: 10 },
  { time: '14:30', blocked: 22 },
];

const chartConfig = {
  blocked: {
    label: 'Blocked',
    color: 'hsl(var(--destructive))',
  },
};

export function BlockedRequestsChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Blocked Requests</CardTitle>
        <CardDescription>Threats blocked in real-time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-destructive">1,402</div>
        <p className="text-xs text-muted-foreground">+15.2% from last hour</p>
        <div className="h-32 mt-4">
          <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-blocked)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-blocked)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area dataKey="blocked" type="natural" fill="url(#fillBlocked)" stroke="var(--color-blocked)" stackId="a" />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
