'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'macOS', value: 25, fill: 'hsl(var(--chart-1))' },
  { name: 'CentOS', value: 20, fill: 'hsl(var(--chart-2))' },
  { name: 'RHEL7', value: 18, fill: 'hsl(var(--chart-3))' },
  { name: 'Windows', value: 22, fill: 'hsl(var(--chart-4))' },
  { name: 'Debian', value: 15, fill: 'hsl(var(--chart-5))' },
];

const chartConfig = {
    value: {
        label: 'Percentage',
    },
    macOS: {
        label: 'macOS',
        color: 'hsl(var(--chart-1))',
    },
    CentOS: {
        label: 'CentOS',
        color: 'hsl(var(--chart-2))',
    },
    RHEL7: {
        label: 'RHEL7',
        color: 'hsl(var(--chart-3))',
    },
    Windows: {
        label: 'Windows',
        color: 'hsl(var(--chart-4))',
    },
    Debian: {
        label: 'Debian',
        color: 'hsl(var(--chart-5))',
    },
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function TopAgentsChart() {
  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 Agents by Alerts</CardTitle>
        <CardDescription>Agents generating the most alerts.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center pb-0">
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
              nameKey="name"
              innerRadius="50%"
              outerRadius="80%"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              verticalAlign="bottom"
              align='center'
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
