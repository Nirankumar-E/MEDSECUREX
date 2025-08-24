import { TTPsTable } from '@/components/ttps/TTPsTable';

export default function TTPsPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl font-bold font-headline">TTPs Detected</h1>
      <p className="text-muted-foreground">
        View all MITRE ATT&CK techniques detected in your environment.
      </p>
      <TTPsTable />
    </div>
  );
}
