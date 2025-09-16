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
    color: '#00BFFF',
  },
  medium: {
    label: 'Medium Severity',
    color: '#00FFB2',
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
            <ChartTooltip content={<ChartTooltipContent 
                formatter={(value, name) => (
                    <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{backgroundColor: chartConfig[name as keyof typeof chartConfig].color}}></span>
                        <span>{chartConfig[name as keyof typeof chartConfig].label}: {value}</span>
                    </div>
                )}
            />} />
            <defs>
              <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.high.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.high.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMedium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.medium.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.medium.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="medium"
              type="natural"
              fill="url(#fillMedium)"
              stroke={chartConfig.medium.color}
              stackId="a"
              strokeWidth={2}
              style={{ filter: `drop-shadow(0 0 6px ${chartConfig.medium.color})` } as React.CSSProperties}
            />
            <Area
              dataKey="high"
              type="natural"
              fill="url(#fillHigh)"
              stroke={chartConfig.high.color}
              stackId="a"
              strokeWidth={2}
               style={{ filter: `drop-shadow(0 0 6px ${chartConfig.high.color})` } as React.CSSProperties}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
