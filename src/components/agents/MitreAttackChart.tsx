'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'Password Guessing', value: 400 },
  { name: 'SSH Brute Force', value: 300 },
  { name: 'Valid Accounts', value: 300 },
  { name: 'System Binary Proxy', value: 200 },
  { name: 'Account Access', value: 100 },
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function MitreAttackChart() {
  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>MITRE ATT&CK</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend
              align="right"
              verticalAlign="middle"
              layout="vertical"
              wrapperStyle={{ right: -10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
