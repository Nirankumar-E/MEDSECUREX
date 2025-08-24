import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive } from 'lucide-react';

export default function MedXBoxPage() {
  return (
    <div className="flex-1 space-y-4">
      <h1 className="text-3xl font-bold font-headline">MED x Box</h1>
      <Card>
        <CardHeader>
          <CardTitle>MED x Box</CardTitle>
          <CardDescription>
            This page is under construction. Check back later for updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-16">
          <div className="text-center text-muted-foreground">
            <Archive className="h-16 w-16 mx-auto mb-4" />
            <p>Content for MED x Box will be here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
