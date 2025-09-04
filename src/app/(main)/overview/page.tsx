
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/alerts">
            <MetricCard 
                icon={ShieldAlert}
                title="Total Alerts (24h)"
                value="1,284"
                description="+5.2% from yesterday"
                iconClassName='text-orange-500'
            />
        </Link>
        <Link href="/alerts">
            <MetricCard 
                icon={AlertCircle}
                title="High Severity Alerts"
                value="73"
                description="-3.1% from yesterday"
                iconClassName='text-red-500'
            />
        </Link>
        <Link href="/incidents">
            <MetricCard 
                icon={FileText}
                title="Open Incidents"
                value="12"
                description="2 require immediate attention"
                iconClassName='text-purple-500'
            />
        </Link>
        <Link href="/ttps">
            <MetricCard 
                icon={BarChart}
                title="TTPs Detected"
                value="48"
                description="T1059.001 most common"
                iconClassName='text-blue-500'
            />
        </Link>
      </div>

      <Separator />

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
