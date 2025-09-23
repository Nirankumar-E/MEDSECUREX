'use client';

import { useState } from 'react';
import { TTPsTable } from '@/components/ttps/TTPsTable';
import { TTPsBubbleChart } from '@/components/ttps/TTPsBubbleChart';
import type { TTP } from '@/types';

export default function TTPsPage() {
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);

  return (
    <div className="flex-1 space-y-6">
      <TTPsBubbleChart onBubbleClick={setSelectedTactic} />
      <TTPsTable selectedTactic={selectedTactic} />
    </div>
  );
}
