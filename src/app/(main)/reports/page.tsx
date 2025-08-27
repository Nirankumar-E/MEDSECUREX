'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import type { Incident, IncidentSeverity, IncidentStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FileDown } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { StatusBadge } from '@/components/ui/StatusBadge';

const SEVERITY_COLORS: Record<IncidentSeverity, string> = {
  Critical: 'hsl(var(--chart-5))',
  High: 'hsl(var(--destructive))',
  Medium: 'hsl(var(--chart-4))',
  Low: 'hsl(var(--chart-2))',
};

const STATUS_COLORS: Record<IncidentStatus, string> = {
  'Open': 'hsl(var(--destructive))',
  'In Progress': 'hsl(var(--chart-4))',
  'Resolved': 'hsl(var(--chart-2))',
  'Closed': 'hsl(var(--primary))',
};


export default function IncidentReportPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const incidentsCollection = collection(db, 'incidents');
        const q = query(incidentsCollection, orderBy('created', 'desc'));
        const incidentsSnapshot = await getDocs(q);
        const incidentsData = incidentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
        setIncidents(incidentsData);
      } catch (error) {
        console.error("Error fetching incidents: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch incident data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [toast]);

  const summary = {
    total: incidents.length,
    byStatus: incidents.reduce((acc, inc) => {
      acc[inc.status] = (acc[inc.status] || 0) + 1;
      return acc;
    }, {} as Record<IncidentStatus, number>),
    bySeverity: incidents.reduce((acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1;
      return acc;
    }, {} as Record<IncidentSeverity, number>),
    recent: incidents.slice(0, 5),
  };

  const statusData = Object.entries(summary.byStatus).map(([name, value]) => ({ name, value }));
  const severityData = Object.entries(summary.bySeverity).map(([name, value]) => ({ name, value }));

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Incident Report", 14, 22);

    doc.setFontSize(12);
    doc.text(`Total Incidents: ${summary.total}`, 14, 32);

    autoTable(doc, {
      startY: 40,
      head: [['Status', 'Count']],
      body: statusData.map(d => [d.name, d.value]),
      theme: 'grid',
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Severity', 'Count']],
      body: severityData.map(d => [d.name, d.value]),
      theme: 'grid',
    });
    
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['ID', 'Title', 'Status', 'Severity', 'Assignee', 'Created']],
        body: summary.recent.map(inc => [inc.id, inc.title, inc.status, inc.severity, inc.assignee, new Date(inc.created).toLocaleDateString()]),
        theme: 'striped',
    });

    doc.save("incident-report.pdf");
    toast({ title: "Report Downloaded", description: "The incident report has been saved as a PDF." });
  };


  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }
  
  return (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Incident Report</h1>
        <Button onClick={generatePDF}>
          <FileDown className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        {Object.entries(summary.byStatus).map(([status, count]) => (
            <Card key={status}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{status}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
            <CardDescription>Distribution of incidents across different statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as IncidentStatus]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
            <CardDescription>Breakdown of incidents based on their severity level.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={severityData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} />
                <Legend />
                <Bar dataKey="value" name="Incidents">
                    {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name as IncidentSeverity]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Top 5 Recent Incidents</CardTitle>
          <CardDescription>A quick look at the most recently created incidents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.recent.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono">{incident.id}</TableCell>
                  <TableCell className="font-medium">{incident.title}</TableCell>
                  <TableCell><StatusBadge status={incident.status} /></TableCell>
                  <TableCell>
                    <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full mr-2" style={{backgroundColor: SEVERITY_COLORS[incident.severity]}}></div>
                        {incident.severity}
                    </div>
                  </TableCell>
                  <TableCell>{incident.assignee}</TableCell>
                  <TableCell>{new Date(incident.created).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
