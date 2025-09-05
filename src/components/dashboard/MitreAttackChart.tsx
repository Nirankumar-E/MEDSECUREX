'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

// Chart Data: Add or update your MITRE ATT&CK techniques here.
// The 'technique' is the label, 'alerts' is the value. The 'fill' will reference a gradient ID.
const chartData = [
  { technique: 'Password Guessing', alerts: 275, fill: 'url(#gradientGreen)' },
  { technique: 'SSH', alerts: 200, fill: 'url(#gradientBlue)' },
  { technique: 'Brute Force', alerts: 187, fill: 'url(#gradientRed)' },
  { technique: 'Valid Accounts', alerts: 173, fill: 'url(#gradientPurple)' },
  { technique: 'System Binary Proxy', alerts: 90, fill: 'url(#gradientOrange)' },
];

// Chart Configuration: Maps data keys to labels and colors for the chart.
const chartConfig = {
  alerts: {
    label: 'Alerts',
  },
  'Password Guessing': {
    label: 'Password Guessing',
    color: 'hsl(120 70% 40%)',
  },
  'SSH': {
    label: 'SSH',
    color: 'hsl(220 70% 50%)',
  },
  'Brute Force': {
    label: 'Brute Force',
    color: 'hsl(var(--destructive))',
  },
  'Valid Accounts': {
    label: 'Valid Accounts',
    color: 'hsl(280 65% 60%)',
  },
  'System Binary Proxy': {
    label: 'System Binary Proxy',
    color: 'hsl(30 80% 55%)',
  },
};

export function MitreAttackChart({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Calculate the total number of incidents from the chart data.
  // Replace this with your actual total or keep it dynamic
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
    <Card className={`rounded-2xl shadow-lg h-full flex flex-col overflow-hidden ${className}`}>
      <div className="relative z-10 flex flex-col h-full">
        <CardHeader className="items-center pb-2">
          <CardTitle>MITRE ATT&amp;CK Techniques</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center p-4">
          <div
            className="relative w-full h-[250px] flex items-center justify-center"
          >
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-full"
            >
              <PieChart>
                <defs>
                    <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(120 80% 50%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(120 70% 40%)" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(220 80% 60%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(220 70% 50%)" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0 90% 60%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(280 75% 70%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(280 65% 60%)" stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id="gradientOrange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(30 90% 65%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(30 80% 55%)" stopOpacity={1}/>
                    </linearGradient>
                </defs>
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const chartTotal = chartData.reduce((acc, curr) => acc + curr.alerts, 0);
                      const percentage = ((data.alerts / chartTotal) * 100).toFixed(1);
                      return (
                        <div className="rounded-lg border bg-background/80 backdrop-blur-sm p-2 shadow-sm text-xs">
                          <p className="font-bold">{data.technique}</p>
                          <p>Count: {data.alerts.toLocaleString()}</p>
                          <p>Percentage: {percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="alerts"
                  nameKey="technique"
                  innerRadius="60%"
                  strokeWidth={0}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                        key={`cell-${entry.technique}`} 
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
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: activeIndex !== null ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-3xl font-bold">{totalAlerts.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">Total Incidents</span>
            </motion.div>
          </div>
          <div className="w-full mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
            {chartData.map((entry) => (
              <div key={entry.technique} className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: chartConfig[entry.technique as keyof typeof chartConfig]?.color }}
                />
                <span>{entry.technique}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
