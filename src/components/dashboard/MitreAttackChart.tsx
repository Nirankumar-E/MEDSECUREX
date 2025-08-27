'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const chartData = [
  { technique: 'Password Guessing', value: 275, fill: 'hsl(var(--chart-1))' },
  { technique: 'SSH Brute Force', value: 200, fill: 'hsl(var(--chart-2))' },
  { technique: 'Valid Accounts', value: 187, fill: 'hsl(var(--chart-3))' },
  { technique: 'System Binary Proxy', value: 173, fill: 'hsl(var(--chart-4))' },
  { technique: 'Account Access', value: 90, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
  value: {
    label: 'Count',
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
      <CardHeader className="items-center pb-0">
        <CardTitle>MITRE ATT&CK Techniques</CardTitle>
        <CardDescription>Top 5 detected techniques</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
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
              height={250}
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
