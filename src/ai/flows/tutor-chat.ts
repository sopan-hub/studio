'use server';

/**
 * @fileOverview AI-powered tutor chat.
 *
 * - tutorChat - A function that provides answers to user questions.
 * - TutorChatInput - The input type for the tutorChat function.
 * - TutorChatOutput - The return type for the tutorChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TutorChatInputSchema = z.object({
  query: z.string().describe('The user\'s question.'),
  notes: z.string().optional().describe('Optional notes provided by the user for context.'),
});
export type TutorChatInput = z.infer<typeof TutorChatInputSchema>;

const TutorChatOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\'s question.'),
});
export type TutorChatOutput = z.infer<typeof TutorChatOutputSchema>;

export async function tutorChat(input: TutorChatInput): Promise<TutorChatOutput> {
  return tutorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tutorChatPrompt',
  input: {schema: TutorChatInputSchema},
  output: {schema: TutorChatOutputSchema},
  prompt: `You are an expert AI Tutor. Your role is to provide a clear and concise answer to the user's question. 
{{#if notes}}
Use the following notes as context to inform your answer:
{{{notes}}}
{{/if}}

User's Question: {{{query}}}

Provide a helpful and accurate answer.`,
});

const tutorChatFlow = ai.defineFlow(
  {
    name: 'tutorChatFlow',
    inputSchema: TutorChatInputSchema,
    outputSchema: TutorChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
