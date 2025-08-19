
'use server';
/**
 * @fileOverview A flow for generating a quiz from study materials.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - QuizInput - The input type for the generateQuiz function.
 * - QuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuizInputSchema = z.object({
  material: z.string().describe("The study material to generate the quiz from. This can be text pasted by the user or extracted from a file."),
});
export type QuizInput = z.infer<typeof QuizInputSchema>;

const QuizQuestionSchema = z.object({
    question: z.string().describe("The quiz question."),
    options: z.array(z.string()).describe("An array of 4-5 multiple-choice options."),
    answer: z.string().describe("The correct answer from the options."),
});

const QuizOutputSchema = z.object({
    title: z.string().describe("A suitable title for the quiz based on the material."),
    questions: z.array(QuizQuestionSchema).describe("An array of 5-10 quiz questions."),
});
export type QuizOutput = z.infer<typeof QuizOutputSchema>;

export async function generateQuiz(input: QuizInput): Promise<QuizOutput> {
  return quizFlow(input);
}

const quizPrompt = ai.definePrompt({
    name: 'quizPrompt',
    input: { schema: QuizInputSchema },
    output: { schema: QuizOutputSchema },
    prompt: `
        You are an expert educator and quiz creator. Your task is to generate a challenging and informative multiple-choice quiz based on the provided study material.

        The quiz should:
        1. Have a relevant title.
        2. Contain between 5 and 10 questions.
        3. For each question, provide 4-5 plausible multiple-choice options.
        4. Clearly indicate the single correct answer for each question.
        5. The questions should cover the key concepts and facts in the material.

        Study Material:
        ---
        {{{material}}}
        ---
    `,
});

const quizFlow = ai.defineFlow(
  {
    name: 'quizFlow',
    inputSchema: QuizInputSchema,
    outputSchema: QuizOutputSchema,
  },
  async (input) => {
    const { output } = await quizPrompt(input);
    return output!;
  }
);
