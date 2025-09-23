'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { TTP } from '@/types';
import ttpsData from '@/components/dashboard/mitre_attack_dataset.json';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface BubbleChartProps {
  onBubbleClick: (tactic: string | null) => void;
}

// Consistent color palette
const tacticColorPalette: Record<string, string> = {
  'Initial Access': 'hsl(var(--bubble-1))',
  'Execution': 'hsl(var(--bubble-2))',
  'Persistence': 'hsl(var(--bubble-3))',
  'Privilege Escalation': 'hsl(var(--bubble-4))',
  'Defense Evasion': 'hsl(var(--bubble-5))',
  'Credential Access': 'hsl(var(--bubble-6))',
  'Discovery': 'hsl(var(--bubble-1))',
  'Lateral Movement': 'hsl(var(--bubble-2))',
  'Collection': 'hsl(var(--bubble-3))',
  'Command and Control': 'hsl(var(--bubble-4))',
  'Exfiltration': 'hsl(var(--bubble-5))',
  'Impact': 'hsl(var(--bubble-6))',
  'Malware': 'hsl(var(--bubble-1))',
  'Exploit': 'hsl(var(--bubble-2))',
  'Phishing': 'hsl(var(--bubble-3))',
  'Brute Force': 'hsl(var(--bubble-4))'
};

const getTacticColor = (tactic: string) => {
    return tacticColorPalette[tactic] || 'hsl(var(--bubble-5))';
}

export function TTPsBubbleChart({ onBubbleClick }: BubbleChartProps) {
  const [ttps, setTtps] = React.useState<TTP[]>([]);
  const [hoveredTactic, setHoveredTactic] = React.useState<string | null>(null);

  React.useEffect(() => {
    const formattedTtps: TTP[] = ttpsData.map((row: any, index: number) => {
        const tactic = row.AttackType || row.Attack_Type || row.Tactic || 'N/A';
        return {
            id: row.MITRE || `TTP-${index}`,
            name: row.Label || row.name || row.Name || 'N/A',
            tactic: tactic,
            description: row.Description || 'No description available.',
            source: row.Signature || 'N/A',
            endpoint: row.Payload || 'N/A',
            count: Math.floor(Math.random() * 200) + 1,
            lastSeen: new Date(Date.now() - Math.floor(Math.random() * 1000 * 3600 * 24 * 30)).toISOString(),
        };
    });
    setTtps(formattedTtps);
  }, []);

  const totalIncidents = React.useMemo(() => ttps.reduce((sum, ttp) => sum + ttp.count, 0), [ttps]);
  
  // Group by tactic to calculate total count per tactic
  const tacticsData = React.useMemo(() => {
    const tactics: Record<string, { count: number, techniques: TTP[] }> = {};
    ttps.forEach(ttp => {
      if (!tactics[ttp.tactic]) {
        tactics[ttp.tactic] = { count: 0, techniques: [] };
      }
      tactics[ttp.tactic].count += ttp.count;
      tactics[ttp.tactic].techniques.push(ttp);
    });
    return Object.entries(tactics).map(([name, data]) => ({
      name,
      ...data
    })).sort((a, b) => b.count - a.count);
  }, [ttps]);

  const maxCount = Math.max(...tacticsData.map(d => d.count));

  const handleBubbleClick = (tactic: string) => {
    onBubbleClick(tactic);
  }

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">TTP Tactics Overview</CardTitle>
        <CardDescription className="text-center">Bubble size represents total incidents for each tactic.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <ChartContainer config={{}} className="h-[400px] w-full">
              <div 
                className="flex flex-wrap items-center justify-center gap-4 p-4"
                onMouseLeave={() => setHoveredTactic(null)}
              >
                {tacticsData.map((tactic) => {
                    const size = 40 + (tactic.count / maxCount) * 120;
                    return (
                        <Tooltip key={tactic.name} delayDuration={100}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    onClick={() => handleBubbleClick(tactic.name)}
                                    onMouseEnter={() => setHoveredTactic(tactic.name)}
                                    className={cn(
                                        'rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out',
                                        'shadow-lg hover:shadow-2xl'
                                    )}
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                        backgroundColor: getTacticColor(tactic.name),
                                        opacity: hoveredTactic === null || hoveredTactic === tactic.name ? 1 : 0.4,
                                        transform: hoveredTactic === tactic.name ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-xs font-medium text-center text-white p-2 break-words">
                                      {tactic.name}
                                    </span>
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-bold">{tactic.name}</p>
                                <p>Incidents: {tactic.count.toLocaleString()}</p>
                                <p>Share: {((tactic.count / totalIncidents) * 100).toFixed(1)}%</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
              </div>
            </ChartContainer>
        </TooltipProvider>
        <div className="text-center mt-4">
            <Button variant="link" onClick={() => onBubbleClick(null)}>Reset Filter</Button>
        </div>
      </CardContent>
    </Card>
  );
}
