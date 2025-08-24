'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

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
  return (
    <Card className="rounded-2xl shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Alert Sources</CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="alerts"
              nameKey="source"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
       <div className="p-6 flex flex-col gap-2 pt-2">
        <div
          className="flex items-center"
          
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{
                backgroundColor: 'hsl(var(--destructive))',
              }}
            />
            <div className="flex-1 text-sm">API Shield</div>
          </div>
          <div className="text-sm font-medium">65 (65%)</div>
        </div>
        <div
          className="flex items-center"
          
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{
                backgroundColor: 'hsl(var(--primary))',
              }}
            />
            <div className="flex-1 text-sm">MED Box</div>
          </div>
          <div className="text-sm font-medium">35 (35%)</div>
        </div>
       </div>
    </Card>
  );
}
