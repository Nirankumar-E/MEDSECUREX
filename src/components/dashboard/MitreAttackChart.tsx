'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'Password Guessing', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'SSH Brute Force', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Valid Accounts', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: 'System Binary Proxy', value: 278, fill: 'hsl(var(--chart-4))' },
  { name: 'Account Access', value: 189, fill: 'hsl(var(--chart-5))' },
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
        <CardTitle>MITRE ATT&amp;CK Techniques</CardTitle>
        <CardDescription>Distribution of observed attack techniques.</CardDescription>
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
              nameKey="name"
              innerRadius="60%"
              strokeWidth={5}
            >
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              verticalAlign="middle"
              align="right"
              layout="vertical"
              wrapperStyle={{ paddingLeft: '20px' }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
