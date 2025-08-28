'use client';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertsOverTimeChart } from '@/components/dashboard/AlertsOverTimeChart';
import { RecentAlertsTable } from '@/components/dashboard/RecentAlertsTable';
import { AlertSourcesChart } from '@/components/dashboard/AlertSourcesChart';
import { TopSystemsChart } from '@/components/dashboard/TopSystemsChart';
import { BarChart, FileText, ShieldAlert, Zap } from 'lucide-react';
import Link from 'next/link';
import { StatisticsBar } from '@/components/dashboard/StatisticsBar';
import { Separator } from '@/components/ui/separator';
import { MitreAttackChart } from '@/components/dashboard/MitreAttackChart';
import { AlertsEvolutionChart } from '@/components/dashboard/AlertsEvolutionChart';

export default function OverviewPage() {
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold font-headline text-center mb-6">Overview</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/alerts">
          <MetricCard
            title="Total Alerts (24h)"
            value="1,284"
            description="+5.2% from yesterday"
            icon={ShieldAlert}
            iconClassName="text-blue-500"
          />
        </Link>
        <Link href="/alerts?severity=High&severity=Critical">
          <MetricCard
            title="High Severity Alerts"
            value="73"
            description="-3.1% from yesterday"
            icon={Zap}
            iconClassName="text-red-500"
          />
        </Link>
        <Link href="/incidents">
          <MetricCard
            title="Open Incidents"
            value="12"
            description="2 requires immediate attention"
            icon={FileText}
            iconClassName="text-yellow-500"
          />
        </Link>
        <Link href="/ttps">
          <MetricCard
            title="TTPs Detected"
            value="48"
            description="Most common: T1059.001"
            icon={BarChart}
            iconClassName="text-green-500"
          />
        </Link>
      </div>

      <Separator className="my-6" />

      <StatisticsBar />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <div className="col-span-12 lg:col-span-4">
          <AlertsOverTimeChart />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <AlertSourcesChart />
            <MitreAttackChart />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-1 pt-4">
        <RecentAlertsTable />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 pt-4">
        <div className="col-span-12 lg:col-span-3">
          <TopSystemsChart />
        </div>
        <div className="col-span-12 lg:col-span-4">
           <AlertsEvolutionChart />
        </div>
      </div>
    </div>
  );
}
