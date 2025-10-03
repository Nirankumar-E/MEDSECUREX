'use server';

import { correlateAlertsTTP, type CorrelateAlertsTTPInput, type CorrelateAlertsTTPOutput } from '@/ai/flows/correlate-alerts-ttp';

export async function getTtpCorrelation(input: CorrelateAlertsTTPInput): Promise<{ data: CorrelateAlertsTTPOutput | null; error: string | null }> {
  try {
    const result = await correlateAlertsTTP(input);
    return { data: result, error: null };
  } catch (e: any) {
    console.error('Error in TTP correlation flow:', e);
    // In a real-world scenario, you might want to provide more generic error messages to the client.
    return { data: null, error: e.message || 'An unexpected error occurred.' };
  }
}

export async function getSuricataAlerts(limit: number = 50): Promise<{ data: any; error: string | null }> {
  const adminKey = "supersecretadminkey";
  // In a real app, this would come from environment variables.
  const gatewayUrl = 'http://127.0.0.1:8000';

  try {
    const response = await fetch(`${gatewayUrl}/admin/suricata-alerts?key=${adminKey}&limit=${limit}`, {
      cache: 'no-store', // Ensure we get fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Gateway returned an error: ${response.status} ${errorText}`);
      if (response.status === 500 && errorText.includes("eve.json not found")) {
        return { data: null, error: 'Could not connect to the API Gateway. Is Suricata running and configured correctly? eve.json not found.' };
      }
       if (response.status === 502) {
         return { data: null, error: 'Could not connect to the API Gateway. Is the gateway running? Upstream request failed.' };
       }
      return { data: null, error: `API Gateway error: ${response.status} - ${errorText}` };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (e: any) {
    console.error('Error fetching Suricata alerts:', e);
    if (e.cause?.code === 'ECONNREFUSED') {
        return { data: null, error: 'Could not connect to the API Gateway. Please ensure the Python gateway service is running on port 8000.' };
    }
    return { data: null, error: 'Failed to fetch Suricata alerts. Please check the server logs.' };
  }
}
