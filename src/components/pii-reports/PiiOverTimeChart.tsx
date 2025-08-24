'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const chartData = [
  { month: 'May', ssn: 120, dob: 150, address: 80 },
  { month: 'June', ssn: 180, dob: 210, address: 110 },
  { month: 'July', ssn: 220, dob: 250, address: 140 },
  { month: 'August', ssn: 250, dob: 280, address: 160 },
  { month: 'September', ssn: 230, dob: 260, address: 150 },
  { month: 'October', ssn: 280, dob: 310, address: 180 },
];

const chartConfig = {
  ssn: { label: 'SSN', color: 'hsl(var(--chart-1))' },
  dob: { label: 'Date of Birth', color: 'hsl(var(--chart-2))' },
  address: { label: 'Address', color: 'hsl(var(--chart-3))' },
};

export function PiiOverTimeChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Scrubbed PII Over Time</CardTitle>
        <CardDescription>Monthly count of scrubbed PII fields by type.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="ssn" stackId="a" fill="var(--color-ssn)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="dob" stackId="a" fill="var(--color-dob)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="address" stackId="a" fill="var(--color-address)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
