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

export default function OverviewPage() {
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline text-center">Overview</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/alerts">
          <MetricCard
            title="Total Alerts"
            value="1,284"
            description="+5.2% from yesterday"
            icon={ShieldAlert}
            iconClassName="text-blue-500"
          />
        </Link>
        <Link href="/alerts?severity=High&severity=Critical">
          <MetricCard
            title="Level 12+ Alerts"
            value="73"
            description="-3.1% from yesterday"
            icon={Zap}
            iconClassName="text-red-500"
          />
        </Link>
        <MetricCard
          title="Authentication Failures"
          value="42"
          description="+10.5% from yesterday"
          icon={AlertCircle}
          iconClassName="text-red-500"
        />
        <MetricCard
          title="Authentication Success"
          value="958"
          description="+2.1% from yesterday"
          icon={CheckCircle}
          iconClassName="text-green-500"
        />
      </div>

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
