
'use server';
/**
 * @fileOverview A flow for generating a summary from study materials.
 *
 * - generateSummary - A function that handles the summary generation process.
 * - SummaryInput - The input type for the generateSummary function.
 * - SummaryOutput - The return type for the generateSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummaryInputSchema = z.object({
  material: z.string().describe("The study material to generate the summary from. This can be text pasted by the user or extracted from a file."),
});
export type SummaryInput = z.infer<typeof SummaryInputSchema>;

const SummaryOutputSchema = z.object({
    title: z.string().describe("A suitable title for the summary based on the material."),
    summary: z.string().describe("A concise and well-structured summary of the key points in the material, formatted in Markdown."),
});
export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

export async function generateSummary(input: SummaryInput): Promise<SummaryOutput> {
  return summarizerFlow(input);
}

const summarizerPrompt = ai.definePrompt({
    name: 'summarizerPrompt',
    input: { schema: SummaryInputSchema },
    output: { schema: SummaryOutputSchema },
    prompt: `
        You are an expert academic assistant. Your task is to generate a clear and concise summary of the provided study material.

        The output should have:
        1. A relevant and engaging title.
        2. A summary that captures the main ideas, key concepts, and important details. The summary must be well-organized and formatted using Markdown (e.g., headings, subheadings, bullet points, bold text) to improve readability.

        Study Material:
        ---
        {{{material}}}
        ---
    `,
});

const summarizerFlow = ai.defineFlow(
  {
    name: 'summarizerFlow',
    inputSchema: SummaryInputSchema,
    outputSchema: SummaryOutputSchema,
  },
  async (input) => {
    const { output } = await summarizerPrompt(input);
    return output!;
  }
);
