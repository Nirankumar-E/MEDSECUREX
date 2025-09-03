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

export function AlertSourcesChart({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const totalAlerts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.alerts, 0);
  }, []);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className={`rounded-2xl shadow-lg h-full flex flex-col ${className}`}>
      <CardHeader className="items-center pb-2">
        <CardTitle>Alert Sources</CardTitle>
        <CardDescription>Last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center p-0">
        <div className="relative w-full h-full">
            <ChartContainer config={chartConfig} className="absolute inset-0">
            <PieChart>
                <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                data={chartData}
                dataKey="alerts"
                nameKey="source"
                innerRadius="60%"
                strokeWidth={5}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                >
                {chartData.map((entry, index) => (
                    <Cell 
                        key={`cell-${entry.source}`} 
                        fill={entry.fill} 
                        style={{
                            transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: 'center center',
                            transition: 'transform 0.2s ease-in-out',
                        }}
                    />
                ))}
                </Pie>
                <ChartLegend
                content={<ChartLegendContent nameKey="source" />}
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                    position: 'relative',
                    bottom: '10px',
                    boxSizing: 'content-box',
                }}
                />
            </PieChart>
            </ChartContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold">{totalAlerts}</span>
                <span className="text-xs text-muted-foreground">Total Alerts</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
