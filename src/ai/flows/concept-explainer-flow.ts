
'use server';
/**
 * @fileOverview A flow for explaining complex concepts simply.
 *
 * - explainConcept - A function that handles the concept explanation process.
 * - ConceptExplainerInput - The input type for the explainConcept function.
 * - ConceptExplainerOutput - The return type for the explainConcept function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ConceptExplainerInputSchema = z.object({
  concept: z.string().describe("The concept, topic, or question to be explained."),
  audience: z.string().optional().describe("The target audience for the explanation (e.g., 'a 5-year-old', 'a high school student', 'a programmer'). Defaults to 'a beginner'.")
});
export type ConceptExplainerInput = z.infer<typeof ConceptExplainerInputSchema>;

const ConceptExplainerOutputSchema = z.object({
    title: z.string().describe("A clear title for the explanation."),
    explanation: z.string().describe("A simple, easy-to-understand explanation of the concept, formatted in Markdown. Use analogies and simple examples."),
    analogy: z.string().optional().describe("A helpful analogy to better illustrate the concept."),
});
export type ConceptExplainerOutput = z.infer<typeof ConceptExplainerOutputSchema>;

export async function explainConcept(input: ConceptExplainerInput): Promise<ConceptExplainerOutput> {
  return conceptExplainerFlow(input);
}

const explainerPrompt = ai.definePrompt({
    name: 'conceptExplainerPrompt',
    input: { schema: ConceptExplainerInputSchema },
    output: { schema: ConceptExplainerOutputSchema },
    prompt: `
        You are an expert educator with a talent for breaking down complex topics into simple, understandable explanations.
        
        Your task is to explain the following concept: {{{concept}}}

        Tailor your explanation for this audience: {{{audience | default "a beginner"}}}

        The explanation should:
        1. Have a clear, descriptive title.
        2. Be written in simple, accessible language.
        3. Use a key analogy or a simple, real-world example to make the concept relatable.
        4. Be formatted using Markdown for readability (headings, lists, bold text).

        Focus on clarity and intuition over technical jargon.
    `,
});

const conceptExplainerFlow = ai.defineFlow(
  {
    name: 'conceptExplainerFlow',
    inputSchema: ConceptExplainerInputSchema,
    outputSchema: ConceptExplainerOutputSchema,
  },
  async (input) => {
    const { output } = await explainerPrompt(input);
    return output!;
  }
);
