'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, Timestamp, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, FileDown, Rocket } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { addDays, format, startOfMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Incident } from '@/types';

interface StatData {
  totalAlerts: number;
  highSeverityAlerts: number;
  authFailures: number;
  authSuccesses: number;
}

const StatCard = ({ title, value, color, isLoading }: { title: string; value: number | null; color: string; isLoading: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <Card className="rounded-2xl shadow-lg h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-3/4" />
        ) : (
          <div className={`text-3xl font-bold ${color}`}>
            {value !== null ? value.toLocaleString() : 'Error'}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export function StatisticsBar() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  useEffect(() => {
    if (!date?.from || !date?.to) return;
    
    setIsLoading(true);
    setError(null);

    const startDate = Timestamp.fromDate(date.from);
    const endDate = Timestamp.fromDate(date.to);

    const queries = {
      totalAlerts: query(collection(db, 'alerts'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate)),
      highSeverityAlerts: query(collection(db, 'alerts'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate), where('severity', '>=', 12)),
      authFailures: query(collection(db, 'auth_logs'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate), where('status', '==', 'failure')),
      authSuccesses: query(collection(db, 'auth_logs'), where('createdAt', '>=', startDate), where('createdAt', '<=', endDate), where('status', '==', 'success')),
      incidents: query(collection(db, 'incidents'), where('created', '>=', startDate), where('created', '<=', endDate)),
    };

    const unsubscribes = Object.entries(queries).map(([key, q]) => {
      return onSnapshot(q, async (snapshot) => {
        try {
          if (key === 'incidents') {
            const incidentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));
            setIncidents(incidentsData);
          } else {
            const count = snapshot.size;
            setStats((prevStats) => ({ ...(prevStats as StatData), [key]: count }));
          }
        } catch (err: any) {
          console.error(`Error fetching ${key}:`, err);
          setError(`Failed to load data for ${key}.`);
        }
      }, (err) => {
        console.error(`Snapshot error for ${key}:`, err);
        setError(`Error listening to ${key}. See console for details.`);
        toast({ variant: 'destructive', title: `Real-time update failed for ${key}`, description: err.message });
      });
    });
    
    // Simulate initial loading finished after a bit
    const timer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      unsubscribes.forEach((unsub) => unsub());
      clearTimeout(timer);
    };

  }, [date, toast]);
  
  const handleGenerateReport = async () => {
    try {
      const incidentsCollection = collection(db, 'incidents');
      const incidentsSnapshot = await getDocs(incidentsCollection);
      const incidentsData = incidentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Incident));

      if (incidentsData.length === 0) {
        toast({ title: 'No Incidents', description: 'There are no incidents to report.' });
        return;
      }
      
      const headers = Object.keys(incidentsData[0]);
      const csvRows = [
        headers.join(','),
        ...incidentsData.map(row =>
          headers.map(fieldName =>
            JSON.stringify(row[fieldName as keyof Incident] ?? '', (key, value) => value ?? '')
          ).join(',')
        )
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.href) {
        URL.revokeObjectURL(link.href);
      }
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', 'incident_report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Report Generated",
        description: "Your incident report has been downloaded.",
      });

    } catch (error: any) {
      console.error("Error generating report: ", error);
      toast({
        variant: "destructive",
        title: "Report Failed",
        description: "Could not generate the incident report. " + error.message,
      });
    }
  };
  
  const handleExploreAgent = () => {
    router.push('/agents');
  };

  const statCards = [
    { title: "Total Alerts", value: stats?.totalAlerts ?? 0, color: "text-blue-500", isLoading: isLoading },
    { title: "Level 12+ Alerts", value: stats?.highSeverityAlerts ?? 0, color: "text-red-500", isLoading: isLoading },
    { title: "Authentication Failures", value: stats?.authFailures ?? 0, color: "text-red-500", isLoading: isLoading },
    { title: "Authentication Success", value: stats?.authSuccesses ?? 0, color: "text-blue-500", isLoading: isLoading },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1">
            {/* Placeholder for potential title or description */}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={'outline'}
                className="w-full sm:w-[280px] justify-start text-left font-normal"
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                    date.to ? (
                    <>
                        {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                    </>
                    ) : (
                    format(date.from, 'LLL dd, y')
                    )
                ) : (
                    <span>Pick a date</span>
                )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                />
            </PopoverContent>
            </Popover>
           <Button variant="outline" onClick={handleExploreAgent} className="w-full sm:w-auto"><Rocket className="mr-2 h-4 w-4"/> Explore Agent</Button>
           <Button onClick={handleGenerateReport} className="w-full sm:w-auto"><FileDown className="mr-2 h-4 w-4"/> Generate Report</Button>
        </div>
      </div>
      
      {error && <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(card => <StatCard key={card.title} {...card} />)}
      </div>
    </div>
  );
}
