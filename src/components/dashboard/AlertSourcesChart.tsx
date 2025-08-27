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
      <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
        <ChartContainer config={chartConfig} className="w-full h-full max-h-[250px] relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold">{totalAlerts}</p>
                <p className="text-xs text-muted-foreground">Total Alerts</p>
            </div>
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
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="source" />}
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{
                boxSizing: 'content-box',
                paddingTop: '20px',
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
