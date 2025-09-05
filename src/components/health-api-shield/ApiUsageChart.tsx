
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const chartData = [
  { time: '14:00', rps: 120, success: 115, errors: 5 },
  { time: '14:05', rps: 150, success: 148, errors: 2 },
  { time: '14:10', rps: 180, success: 175, errors: 5 },
  { time: '14:15', rps: 130, success: 130, errors: 0 },
  { time: '14:20', rps: 200, success: 190, errors: 10 },
  { time: '14:25', rps: 160, success: 160, errors: 0 },
  { time: '14:30', rps: 190, success: 185, errors: 5 },
];

const chartConfig = {
  rps: {
    label: 'RPS',
    color: 'hsl(var(--chart-1))',
  },
  success: {
    label: 'Success',
    color: 'hsl(var(--chart-2))',
  },
  errors: {
    label: 'Errors',
    color: 'hsl(var(--destructive))',
  },
};

export function ApiUsageChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>API Usage</CardTitle>
        <CardDescription>Real-time requests per second, success, and error rates.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
             <defs>
              <linearGradient id="fillRps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-rps)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-rps)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillErrors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-errors)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-errors)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="rps" stroke="var(--color-rps)" fill="url(#fillRps)" strokeWidth={2} dot={false} />
            <Area yAxisId="left" type="monotone" dataKey="success" stroke="var(--color-success)" fill="url(#fillSuccess)" strokeWidth={2} dot={false} />
            <Area yAxisId="left" type="monotone" dataKey="errors" stroke="var(--color-errors)" fill="url(#fillErrors)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
