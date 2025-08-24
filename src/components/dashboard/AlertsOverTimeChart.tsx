'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { month: 'January', high: 186, medium: 80, low: 20 },
  { month: 'February', high: 305, medium: 200, low: 40 },
  { month: 'March', high: 237, medium: 120, low: 30 },
  { month: 'April', high: 73, medium: 190, low: 10 },
  { month: 'May', high: 209, medium: 130, low: 25 },
  { month: 'June', high: 214, medium: 140, low: 35 },
];

const chartConfig = {
  high: {
    label: 'High Severity',
    color: 'hsl(var(--destructive))',
  },
  medium: {
    label: 'Medium Severity',
    color: 'hsl(var(--primary))',
  },
  low: {
    label: 'Low Severity',
    color: 'hsl(var(--accent))',
  },
};

export function AlertsOverTimeChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Alerts Over Time</CardTitle>
        <CardDescription>Total alerts by severity over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-high)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-high)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-medium)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-medium)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="medium"
              type="natural"
              fill="url(#fillMedium)"
              stroke="var(--color-medium)"
              stackId="a"
            />
            <Area
              dataKey="high"
              type="natural"
              fill="url(#fillHigh)"
              stroke="var(--color-high)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
