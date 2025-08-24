import { MetricCard } from '@/components/dashboard/MetricCard';
import { AlertsOverTimeChart } from '@/components/dashboard/AlertsOverTimeChart';
import { RecentAlertsTable } from '@/components/dashboard/RecentAlertsTable';
import { BarChart, FileText, ShieldAlert, Zap } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl font-bold font-headline">Overview</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Alerts (24h)"
          value="1,284"
          description="+5.2% from yesterday"
          icon={ShieldAlert}
          iconClassName="text-blue-500"
        />
        <MetricCard
          title="High Severity Alerts"
          value="73"
          description="-3.1% from yesterday"
          icon={Zap}
          iconClassName="text-red-500"
        />
        <MetricCard
          title="Open Incidents"
          value="12"
          description="2 requires immediate attention"
          icon={FileText}
          iconClassName="text-yellow-500"
        />
        <MetricCard
          title="TTPs Detected"
          value="48"
          description="Most common: T1059.001"
          icon={BarChart}
          iconClassName="text-green-500"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-12 lg:col-span-4">
          <AlertsOverTimeChart />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <RecentAlertsTable />
        </div>
      </div>
    </div>
  );
}
