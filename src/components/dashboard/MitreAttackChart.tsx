'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { technique: 'Password Guessing', alerts: 275, fill: 'hsl(var(--chart-1))' },
  { technique: 'SSH Brute Force', alerts: 200, fill: 'hsl(var(--chart-2))' },
  { technique: 'Valid Accounts', alerts: 187, fill: 'hsl(var(--chart-3))' },
  { technique: 'System Binary Proxy', alerts: 173, fill: 'hsl(var(--chart-4))' },
  { technique: 'Account Access', alerts: 90, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  alerts: {
    label: 'Alerts',
  },
  'Password Guessing': {
    label: 'Password Guessing',
    color: 'hsl(var(--chart-1))',
  },
  'SSH Brute Force': {
    label: 'SSH Brute Force',
    color: 'hsl(var(--chart-2))',
  },
  'Valid Accounts': {
    label: 'Valid Accounts',
    color: 'hsl(var(--chart-3))',
  },
  'System Binary Proxy': {
    label: 'System Binary Proxy',
    color: 'hsl(var(--chart-4))',
  },
  'Account Access': {
    label: 'Account Access',
    color: 'hsl(var(--chart-5))',
  },
};

export function MitreAttackChart() {
    const totalAlerts = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.alerts, 0);
    }, []);

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>MITRE ATT&amp;CK</CardTitle>
        <CardDescription>Top 5 Techniques</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              position={{ y: -10 }}
            />
            <Pie
              data={chartData}
              dataKey="alerts"
              nameKey="technique"
              innerRadius="60%"
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.technique}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-4xl font-bold">
                {totalAlerts.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground mt-1">Total Detections</span>
        </div>
      </CardContent>
    </Card>
  );
}
