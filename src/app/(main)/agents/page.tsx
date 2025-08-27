import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AgentsPage() {
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold font-headline text-center mb-6">Agents</h1>
      <Card>
        <CardHeader>
          <CardTitle>Explore Agent</CardTitle>
          <CardDescription>This is the page for exploring agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Agent exploration functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
