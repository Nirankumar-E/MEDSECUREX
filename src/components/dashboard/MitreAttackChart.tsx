'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { technique: 'Password Guessing', alerts: 275, fill: 'hsl(var(--chart-1))' },
  { technique: 'SSH', alerts: 200, fill: 'hsl(var(--chart-2))' },
  { technique: 'Brute Force', alerts: 187, fill: 'hsl(var(--chart-3))' },
  { technique: 'Valid Accounts', alerts: 173, fill: 'hsl(var(--chart-4))' },
  { technique: 'System Binary Proxy', alerts: 90, fill: 'hsl(var(--chart-5))' },
  { technique: 'Account Access Re...', alerts: 50, fill: 'hsl(var(--muted))' },
];

const chartConfig = {
  alerts: {
    label: 'Alerts',
  },
  'Password Guessing': {
    label: 'Password Guessing',
    color: 'hsl(var(--chart-1))',
  },
  'SSH': {
    label: 'SSH',
    color: 'hsl(var(--chart-2))',
  },
  'Brute Force': {
    label: 'Brute Force',
    color: 'hsl(var(--chart-3))',
  },
  'Valid Accounts': {
    label: 'Valid Accounts',
    color: 'hsl(var(--chart-4))',
  },
  'System Binary Proxy': {
    label: 'System Binary Proxy',
    color: 'hsl(var(--chart-5))',
  },
  'Account Access Re...': {
    label: 'Account Access Re...',
    color: 'hsl(var(--muted))',
  },
};

export function MitreAttackChart({ className }: { className?: string }) {
    const totalAlerts = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.alerts, 0);
    }, []);

  return (
    <Card className={`rounded-2xl shadow-lg h-full flex flex-col ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>MITRE ATT&amp;CK</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-2 gap-4 w-full h-full items-center">
            <div className="col-span-1">
                <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-full max-h-[200px]"
                >
                <PieChart>
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
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
            </div>
            <div className="col-span-1 flex flex-col gap-2 text-sm">
                {chartData.map((entry) => (
                    <div key={entry.technique} className="flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: entry.fill }}
                        />
                        <span>{entry.technique}</span>
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
