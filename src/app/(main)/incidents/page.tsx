import { IncidentsTable } from '@/components/incidents/IncidentsTable';

export default function IncidentsPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl font-bold font-headline">Incidents</h1>
      <p className="text-muted-foreground">
        Track and manage security incidents.
      </p>
      <IncidentsTable />
    </div>
  );
}
