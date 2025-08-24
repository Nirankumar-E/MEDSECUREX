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
