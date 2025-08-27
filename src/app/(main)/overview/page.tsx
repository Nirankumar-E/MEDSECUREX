'use client';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertsOverTimeChart } from '@/components/dashboard/AlertsOverTimeChart';
import { RecentAlertsTable } from '@/components/dashboard/RecentAlertsTable';
import { AlertSourcesChart } from '@/components/dashboard/AlertSourcesChart';
import { BarChart, FileText, ShieldAlert, Zap } from 'lucide-react';
import Link from 'next/link';
import { StatisticsBar } from '@/components/dashboard/StatisticsBar';
import { Separator } from '@/components/ui/separator';

export default function OverviewPage() {
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold font-headline text-center mb-6">Overview</h1>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <AlertSourcesChart />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <div className="col-span-12">
              <RecentAlertsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
