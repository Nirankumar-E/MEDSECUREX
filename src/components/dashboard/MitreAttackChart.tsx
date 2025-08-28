'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

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
  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>MITRE ATT&CK</CardTitle>
        <CardDescription>Top 5 Techniques</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-[250px]"
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
            <ChartLegend
                content={<ChartLegendContent nameKey="technique" />}
                verticalAlign="middle"
                align="right"
                layout="vertical"
                wrapperStyle={{
                    paddingLeft: '20px'
                }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
