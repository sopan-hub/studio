
'use server';
/**
 * @fileOverview A flow for generating flashcards from study materials.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - FlashcardInput - The input type for the generateFlashcards function.
 * - FlashcardOutput - The return type for the generateFlashcards function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FlashcardInputSchema = z.object({
  material: z.string().describe("The study material to generate the flashcards from."),
});
export type FlashcardInput = z.infer<typeof FlashcardInputSchema>;

const FlashcardSchema = z.object({
    question: z.string().describe("The question or term for the front of the flashcard."),
    answer: z.string().describe("The answer or definition for the back of the flashcard."),
});

const FlashcardOutputSchema = z.object({
    title: z.string().describe("A suitable title for the flashcard deck based on the material."),
    flashcards: z.array(FlashcardSchema).describe("An array of 10-20 flashcards."),
});
export type FlashcardOutput = z.infer<typeof FlashcardOutputSchema>;

export async function generateFlashcards(input: FlashcardInput): Promise<FlashcardOutput> {
  return flashcardFlow(input);
}

const flashcardPrompt = ai.definePrompt({
    name: 'flashcardPrompt',
    input: { schema: FlashcardInputSchema },
    output: { schema: FlashcardOutputSchema },
    prompt: `
        You are an expert in creating effective learning materials. Your task is to generate a deck of flashcards from the provided study material.

        The flashcard deck should:
        1. Have a relevant title for the deck.
        2. Contain between 10 and 20 flashcards.
        3. Each flashcard must have a clear "question" (term, concept) and a concise "answer" (definition, explanation).
        4. Focus on the most important keywords, concepts, and facts in the material.

        Study Material:
        ---
        {{{material}}}
        ---
    `,
});

const flashcardFlow = ai.defineFlow(
  {
    name: 'flashcardFlow',
    inputSchema: FlashcardInputSchema,
    outputSchema: FlashcardOutputSchema,
  },
  async (input) => {
    const { output } = await flashcardPrompt(input);
    return output!;
  }
);
