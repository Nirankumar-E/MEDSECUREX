'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

const chartData = [
  { date: '2023-10-21', ssn: 15, dob: 25, address: 10 },
  { date: '2023-10-22', ssn: 22, dob: 30, address: 15 },
  { date: '2023-10-23', ssn: 18, dob: 28, address: 12 },
  { date: '2023-10-24', ssn: 35, dob: 40, address: 20 },
  { date: '2023-10-25', ssn: 28, dob: 35, address: 18 },
  { date: '2023-10-26', ssn: 42, dob: 50, address: 25 },
  { date: '2023-10-27', ssn: 30, dob: 45, address: 22 },
];

const chartConfig = {
  ssn: { label: 'SSN', color: 'hsl(var(--chart-1))' },
  dob: { label: 'Date of Birth', color: 'hsl(var(--chart-2))' },
  address: { label: 'Address', color: 'hsl(var(--chart-3))' },
};

export function PiiScrubbingReportChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>PII Scrubbing Reports</CardTitle>
        <CardDescription>PII instances identified and scrubbed from API traffic per day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} tickLine={false} axisLine={false} tickMargin={8} />
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
