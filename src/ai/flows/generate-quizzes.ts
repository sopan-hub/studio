// src/ai/flows/generate-quizzes.ts
'use server';

/**
 * @fileOverview A quiz generation AI agent.
 *
 * - generateQuizzes - A function that handles the quiz generation process.
 * - GenerateQuizzesInput - The input type for the generateQuizzes function.
 * - GenerateQuizzesOutput - The return type for the generateQuizzes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizzesInputSchema = z.object({
  notes: z
    .string()
    .describe('The notes to generate the quizzes from.'),
});
export type GenerateQuizzesInput = z.infer<typeof GenerateQuizzesInputSchema>;

const GenerateQuizzesOutputSchema = z.object({
  multipleChoice: z.array(z.object({
    question: z.string().describe('The multiple choice question.'),
    options: z.array(z.string()).describe('The possible answers.'),
    answer: z.string().describe('The correct answer.'),
  })).describe('The multiple choice questions.'),
  shortAnswer: z.array(z.object({
    question: z.string().describe('The short answer question.'),
    answer: z.string().describe('The answer to the question.'),
  })).describe('The short answer questions.'),
});
export type GenerateQuizzesOutput = z.infer<typeof GenerateQuizzesOutputSchema>;

export async function generateQuizzes(input: GenerateQuizzesInput): Promise<GenerateQuizzesOutput> {
  return generateQuizzesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizzesPrompt',
  input: {schema: GenerateQuizzesInputSchema},
  output: {schema: GenerateQuizzesOutputSchema},
  prompt: `You are an AI quiz generator. You will take the notes provided and generate multiple choice and short answer quizzes.

Notes: {{{notes}}}

Ensure the output is valid JSON.`, 
});

const generateQuizzesFlow = ai.defineFlow(
  {
    name: 'generateQuizzesFlow',
    inputSchema: GenerateQuizzesInputSchema,
    outputSchema: GenerateQuizzesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output,
      progress: 'Generated multiple choice and short answer quizzes from the provided notes.',
    } as GenerateQuizzesOutput;
  }
);
