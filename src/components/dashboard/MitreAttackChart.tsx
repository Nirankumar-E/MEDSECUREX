
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { technique: 'Password Guessing', alerts: 275, fill: 'hsl(120 70% 40%)' }, // Green
  { technique: 'SSH', alerts: 200, fill: 'hsl(220 70% 50%)' }, // Blue
  { technique: 'Brute Force', alerts: 187, fill: 'hsl(0 70% 50%)' }, // Red
  { technique: 'Valid Accounts', alerts: 173, fill: 'hsl(280 65% 60%)' }, // Purple
  { technique: 'System Binary Proxy', alerts: 90, fill: 'hsl(30 80% 55%)' }, // Orange
];

const chartConfig = {
  alerts: {
    label: 'Alerts',
  },
  'Password Guessing': {
    label: 'Password Guessing',
    color: 'hsl(120 70% 40%)',
  },
  'SSH': {
    label: 'SSH',
    color: 'hsl(220 70% 50%)',
  },
  'Brute Force': {
    label: 'Brute Force',
    color: 'hsl(0 70% 50%)',
  },
  'Valid Accounts': {
    label: 'Valid Accounts',
    color: 'hsl(280 65% 60%)',
  },
  'System Binary Proxy': {
    label: 'System Binary Proxy',
    color: 'hsl(30 80% 55%)',
  },
};

export function MitreAttackChart({ className }: { className?: string }) {
    const totalAlerts = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.alerts, 0);
    }, []);

  return (
    <Card className={`rounded-2xl shadow-lg h-full flex flex-col ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>MITRE ATT&amp;CK Techniques</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-full h-[250px] flex items-center justify-center">
            <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-full"
            >
            <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const percentage = ((data.alerts / totalAlerts) * 100).toFixed(1);
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                          <p className="font-bold">{data.technique}</p>
                          <p>Count: {data.alerts.toLocaleString()}</p>
                          <p>Percentage: {percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">{totalAlerts.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Total Incidents</span>
            </div>
        </div>
        <div className="w-full mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            {chartData.map((entry) => (
                <div key={entry.technique} className="flex items-center gap-2">
                    <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                    />
                    <span>{entry.technique}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
