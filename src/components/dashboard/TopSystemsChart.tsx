'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { RadialBarChart, RadialBar, PolarAngleAxis, Legend, Tooltip, Cell } from 'recharts';

// Chart Data: Add or update your OS data here.
// The 'name' is the label, 'value' is the alert count, and 'fill' is the color.
const chartData = [
  { name: 'Windows', value: 450, fill: 'hsl(var(--chart-1))' },
  { name: 'Linux', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'macOS', value: 150, fill: 'hsl(var(--chart-3))' },
  { name: 'Other', value: 100, fill: 'hsl(var(--muted))' },
];

const chartConfig = {
  value: { label: 'Alerts' },
  Windows: { label: 'Windows', color: 'hsl(var(--chart-1))' },
  Linux: { label: 'Linux', color: 'hsl(var(--chart-2))' },
  macOS: { label: 'macOS', color: 'hsl(var(--chart-3))' },
  Other: { label: 'Other', color: 'hsl(var(--muted))' },
};

// Custom Label for Radial Bar segments
const CustomLabel = ({ viewBox, value, name, percentage }: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, midAngle } = viewBox;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <g>
      <text x={x} y={y - 10} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="12" fontWeight="bold">
        {name}
      </text>
      <text x={x} y={y + 5} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10">
        {value} ({percentage}%)
      </text>
    </g>
  );
};


export function TopSystemsChart() {
  const totalAlerts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader className="items-center pb-2">
        <CardTitle>Alerts by System OS</CardTitle>
        <CardDescription>Top operating systems generating alerts</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full"
        >
          <RadialBarChart
            data={chartData}
            innerRadius="30%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <Tooltip
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage = ((data.value / totalAlerts) * 100).toFixed(1);
                    return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {data.name}
                            </span>
                            <span className="font-bold text-muted-foreground">
                                {data.value.toLocaleString()}
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
            <PolarAngleAxis type="number" domain={[0, totalAlerts]} tick={false} />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
            >
              {chartData.map((entry) => (
                <Cell 
                    key={`cell-${entry.name}`} 
                    fill={entry.fill}
                />
              ))}
            </RadialBar>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-sm"
              dy={14}
            >
              Total Alerts
            </text>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
