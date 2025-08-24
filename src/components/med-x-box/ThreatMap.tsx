'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export function ThreatMap() {
  return (
    <Card className="rounded-2xl shadow-lg h-full">
      <CardHeader>
        <CardTitle>Threat Sources by Location</CardTitle>
        <CardDescription>Geographic distribution of incoming threats.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video relative">
            <Image 
                src="https://placehold.co/800x450.png"
                alt="World map with threat locations"
                fill
                className="object-cover rounded-b-2xl"
                data-ai-hint="world map"
            />
        </div>
      </CardContent>
    </Card>
  );
}
