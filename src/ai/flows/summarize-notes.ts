'use server';

/**
 * @fileOverview AI flow for summarizing user-uploaded study notes.
 *
 * - summarizeNotes - A function that generates short, medium, and detailed summaries from notes.
 * - SummarizeNotesInput - The input type for the summarizeNotes function.
 * - SummarizeNotesOutput - The return type for the summarizeNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNotesInputSchema = z.object({
  notes: z
    .string()
    .describe('The study notes to be summarized.'),
});
export type SummarizeNotesInput = z.infer<typeof SummarizeNotesInputSchema>;

const SummarizeNotesOutputSchema = z.object({
  shortSummary: z.string().describe('A short, concise summary of the notes.'),
  mediumSummary: z.string().describe('A medium-length summary of the notes.'),
  detailedSummary: z.string().describe('A detailed summary of the notes.'),
});
export type SummarizeNotesOutput = z.infer<typeof SummarizeNotesOutputSchema>;

export async function summarizeNotes(input: SummarizeNotesInput): Promise<SummarizeNotesOutput> {
  return summarizeNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: SummarizeNotesInputSchema},
  output: {schema: SummarizeNotesOutputSchema},
  prompt: `You are an expert summarizer, capable of creating summaries of varying lengths.

  Please provide a short, medium, and detailed summary of the following study notes:

  Notes: {{{notes}}}

  Short Summary: (Approximately 2-3 sentences)
  Medium Summary: (Approximately 5-7 sentences)
  Detailed Summary: (Approximately 10-15 sentences)

  Ensure that each summary captures the key concepts and information from the original notes.
`,
});

const summarizeNotesFlow = ai.defineFlow(
  {
    name: 'summarizeNotesFlow',
    inputSchema: SummarizeNotesInputSchema,
    outputSchema: SummarizeNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
