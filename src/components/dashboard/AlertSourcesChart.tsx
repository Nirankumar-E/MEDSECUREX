'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { source: 'API Shield', alerts: 65, fill: 'hsl(var(--destructive))' },
  { source: 'MED Box', alerts: 35, fill: 'hsl(var(--primary))' },
];

const chartConfig = {
  alerts: {
    label: 'Alerts',
  },
  'API Shield': {
    label: 'API Shield',
    color: 'hsl(var(--destructive))',
  },
  'MED Box': {
    label: 'MED Box',
    color: 'hsl(var(--primary))',
  },
};

export function AlertSourcesChart() {
    const totalAlerts = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.alerts, 0);
    }, []);

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Alert Sources</CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-0 relative">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="alerts"
              nameKey="source"
              innerRadius="60%"
              strokeWidth={5}
              labelLine={false}
            >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.source}`} fill={entry.fill} />
                ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="source" />}
              verticalAlign="bottom"
              align="center"
              height={40}
              wrapperStyle={{
                boxSizing: 'content-box',
                margin: '0 auto',
                paddingTop: '20px'
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
