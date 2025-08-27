'use client';

import { AlertsEvolutionChart } from "@/components/agents/AlertsEvolutionChart";
import { MitreAttackChart } from "@/components/agents/MitreAttackChart";
import { TopAgentsChart } from "@/components/agents/TopAgentsChart";

export default function AgentsPage() {
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold font-headline text-center mb-6">MITRE ATT&CK</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <MitreAttackChart />
        </div>
        <div className="col-span-1">
          <TopAgentsChart />
        </div>
        <div className="col-span-1 md:col-span-2">
          <AlertsEvolutionChart />
        </div>
      </div>
    </div>
  );
}
