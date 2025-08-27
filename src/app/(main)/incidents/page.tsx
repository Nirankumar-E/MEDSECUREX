'use client';

import { useState } from 'react';
import { IncidentsTable } from '@/components/incidents/IncidentsTable';
import type { Incident, IncidentSeverity, IncidentStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { IncidentStatusChart } from '@/components/incidents/IncidentStatusChart';
import { IncidentSeverityChart } from '@/components/incidents/IncidentSeverityChart';
import { RecentIncidentsTable } from '@/components/incidents/RecentIncidentsTable';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const mockIncidents: Incident[] = [
  { id: 'INC-001', title: 'Ransomware attack on SRV-DB01', status: 'In Progress', severity: 'Critical', assignee: 'Dr. Alex Chen', created: '2023-10-27 15:00:00' },
  { id: 'INC-002', title: 'Data exfiltration from patient records DB', status: 'Open', severity: 'Critical', assignee: 'Unassigned', created: '2023-10-27 10:00:00' },
  { id: 'INC-003', title: 'C2 communication from PC-MKTG-05', status: 'In Progress', severity: 'High', assignee: 'Ben Carter', created: '2023-10-27 09:00:00' },
  { id: 'INC-004', title: 'Brute-force attempts on admin account', status: 'Resolved', severity: 'High', assignee: 'Ben Carter', created: '2023-10-27 08:00:00' },
  { id: 'INC-005', title: 'Suspicious PowerShell execution on SRV-WEB02', status: 'Resolved', severity: 'High', assignee: 'Casey Day', created: '2023-10-26 23:00:00' },
  { id: 'INC-006', title: 'Suspicious scheduled task on SRV-APP03', status: 'Resolved', severity: 'Medium', assignee: 'Casey Day', created: '2023-10-26 18:00:00' },
  { id: 'INC-007', title: 'Phishing email campaign detected', status: 'Closed', severity: 'Medium', assignee: 'Ben Carter', created: '2023-10-26 12:00:00' },
  { id: 'INC-008', title: 'User added to privileged group', status: 'Closed', severity: 'Low', assignee: 'Casey Day', created: '2023-10-26 11:00:00' },
  { id: 'INC-009', title: 'Anomalous API usage for user_123', status: 'Open', severity: 'High', assignee: 'Unassigned', created: '2023-10-27 14:40:00' },
  { id: 'INC-010', title: 'PII leakage in API response', status: 'In Progress', severity: 'Critical', assignee: 'Dr. Alex Chen', created: '2023-10-27 14:35:10' },
  { id: 'INC-011', title: 'Excessive 4xx errors from client IP', status: 'In Progress', severity: 'Medium', assignee: 'Ben Carter', created: '2023-10-27 13:50:25' },
  { id: 'INC-012', title: 'Potential API scraping activity', status: 'Resolved', severity: 'High', assignee: 'Casey Day', created: '2023-10-26 21:30:00' },
];

export default function IncidentsPage() {
  const [incidents] = useState<Incident[]>(mockIncidents);
  const { toast } = useToast();

  const statusCounts = incidents.reduce((acc, incident) => {
    acc[incident.status] = (acc[incident.status] || 0) + 1;
    return acc;
  }, {} as Record<IncidentStatus, number>);

  const severityCounts = incidents.reduce((acc, incident) => {
    acc[incident.severity] = (acc[incident.severity] || 0) + 1;
    return acc;
  }, {} as Record<IncidentSeverity, number>);

  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, 5);

  const handleDownloadReport = async () => {
    toast({ title: 'Generating Report...', description: 'Please wait while we prepare your PDF.' });
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
      });
  
      const statusChartElement = document.getElementById('status-chart');
      const severityChartElement = document.getElementById('severity-chart');
      const recentIncidentsTableElement = document.getElementById('recent-incidents-table');
      
      doc.setTextColor(210, 40, 98); // foreground
      doc.text("Incidents Report", 20, 20);
      doc.line(20, 22, doc.internal.pageSize.getWidth() - 20, 22);
  
      doc.setFontSize(12);
      doc.text(`Total Incidents: ${incidents.length}`, 20, 40);
  
      let currentY = 50;
  
      if (statusChartElement) {
        const canvas = await html2canvas(statusChartElement, { backgroundColor: '#020817' }); // dark background
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pdfWidth / 2 - 30;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
      }
  
      if (severityChartElement) {
        const canvas = await html2canvas(severityChartElement, { backgroundColor: '#020817' });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pdfWidth / 2 - 30;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.addImage(imgData, 'PNG', pdfWidth / 2, currentY, imgWidth, imgHeight);
      }
      
      currentY += 160;

      if(recentIncidentsTableElement) {
        const canvas = await html2canvas(recentIncidentsTableElement, { backgroundColor: '#020817' });
        const imgData = canvas.toDataURL('image/png');
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const imgWidth = pdfWidth - 40;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
        doc.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
      }
  
      doc.save("incidents-report.pdf");
      toast({ title: 'Success!', description: 'Your report has been downloaded.' });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate PDF report.' });
    }
  };
  

  return (
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold font-headline">Incidents</h1>
            <p className="text-muted-foreground">
                Track, manage, and analyze security incidents.
            </p>
        </div>
        <Button 
            onClick={handleDownloadReport}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg hover:scale-105 hover:brightness-90 transform transition-transform duration-200"
        >
            <FileDown className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>
      
      {/* Report Summary Section */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-1 flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle className="text-muted-foreground">Total Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{incidents.length}</p>
            </CardContent>
          </Card>
          <div id="status-chart" className="lg:col-span-1">
            <IncidentStatusChart data={statusCounts} />
          </div>
          <div id="severity-chart" className="lg:col-span-1">
             <IncidentSeverityChart data={severityCounts} />
          </div>
        </div>

        <div id="recent-incidents-table">
          <RecentIncidentsTable incidents={recentIncidents} />
        </div>
      </div>

      <IncidentsTable incidents={incidents} />
    </div>
  );
}
