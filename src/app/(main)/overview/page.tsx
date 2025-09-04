'use client';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertsOverTimeChart } from '@/components/dashboard/AlertsOverTimeChart';
import { RecentAlertsTable } from '@/components/dashboard/RecentAlertsTable';
import { AlertSourcesChart } from '@/components/dashboard/AlertSourcesChart';
import { TopSystemsChart } from '@/components/dashboard/TopSystemsChart';
import { BarChart, FileText, ShieldAlert, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { MitreAttackChart } from '@/components/dashboard/MitreAttackChart';
import { AlertsEvolutionChart } from '@/components/dashboard/AlertsEvolutionChart';
import { StatisticsBar } from '@/components/dashboard/StatisticsBar';

export default function OverviewPage() {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-center">Overview</h1>
      </div>

      <StatisticsBar />

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-12 lg:col-span-4">
            <AlertsOverTimeChart />
        </div>
        <div className="col-span-12 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-full">
                <AlertSourcesChart />
                <MitreAttackChart />
            </div>
        </div>
      </div>
      
      <div>
        <RecentAlertsTable />
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <TopSystemsChart />
        <AlertsEvolutionChart />
      </div>

    </div>
  );
}
