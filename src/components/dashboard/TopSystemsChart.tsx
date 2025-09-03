'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const chartData = [
  { os: 'Windows', alerts: 450, fill: 'hsl(var(--chart-1))' },
  { os: 'Linux', alerts: 300, fill: 'hsl(var(--chart-2))' },
  { os: 'macOS', alerts: 150, fill: 'hsl(var(--chart-3))' },
  { os: 'Other', alerts: 100, fill: 'hsl(var(--muted))' },
];

const chartConfig = {
  alerts: {
    label: 'Alerts',
  },
  Windows: {
    label: 'Windows',
    color: 'hsl(var(--chart-1))',
  },
  Linux: {
    label: 'Linux',
    color: 'hsl(var(--chart-2))',
  },
  macOS: {
    label: 'macOS',
    color: 'hsl(var(--chart-3))',
  },
  Other: {
    label: 'Other',
    color: 'hsl(var(--muted))',
  },
};

export function TopSystemsChart() {
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
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Alerts by System OS</CardTitle>
        <CardDescription>Top operating systems generating alerts</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-video max-h-[250px]"
        >
          <PieChart>
            <Tooltip
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage = ((data.alerts / totalAlerts) * 100).toFixed(1);
                    return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {data.os}
                            </span>
                            <span className="font-bold text-muted-foreground">
                                {data.alerts.toLocaleString()}
                            </span>
                            </div>
                            <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Percent
                            </span>
                            <span className="font-bold">
                                {percentage}%
                            </span>
                            </div>
                        </div>
                        </div>
                    );
                    }
                    return null;
                }}
            />
            <Pie 
              data={chartData} 
              dataKey="alerts" 
              nameKey="os" 
              innerRadius="60%"
              strokeWidth={0}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={entry.os} 
                  fill={entry.fill} 
                  style={{
                    transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
