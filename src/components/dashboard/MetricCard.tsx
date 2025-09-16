
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  className?: string;
  iconClassName?: string;
  detailsContent?: ReactNode;
}

export function MetricCard({ icon: Icon, title, value, description, className, iconClassName, detailsContent }: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "rounded-2xl shadow-lg transition-all duration-300 h-full overflow-hidden",
        "border border-[#2fc1a6]/50",
        "hover:border-[#2fc1a6] hover:shadow-[0_0_15px_2px_#2fc1a640]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={cn("h-5 w-5 text-muted-foreground", iconClassName)} />
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-3xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </div>

      <AnimatePresence>
        {isHovered && detailsContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-muted/50 border-t">
                {detailsContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
