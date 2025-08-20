
'use server';
/**
 * @fileOverview A flow for solving math problems.
 *
 * - solveMathProblem - A function that handles solving math problems.
 * - MathSolverInput - The input type for the solveMathProblem function.
 * - MathSolverOutput - The return type for the solveMathProblem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MathSolverInputSchema = z.object({
  problem: z.string().describe("The math problem to solve, e.g., '2x + 5 = 15' or 'Find the integral of x^2'. It can also be a word problem."),
});
export type MathSolverInput = z.infer<typeof MathSolverInputSchema>;

const MathSolverOutputSchema = z.object({
    problemType: z.string().describe("The type of math problem identified (e.g., 'Linear Algebra', 'Calculus', 'Word Problem')."),
    finalAnswer: z.string().describe("The final, calculated answer to the problem. Format it clearly, possibly using LaTeX for complex notation."),
    stepByStepSolution: z.string().describe("A detailed, step-by-step explanation of how the solution was reached, formatted in Markdown. Each step should be clearly explained."),
});
export type MathSolverOutput = z.infer<typeof MathSolverOutputSchema>;

export async function solveMathProblem(input: MathSolverInput): Promise<MathSolverOutput> {
  return mathSolverFlow(input);
}

const mathSolverPrompt = ai.definePrompt({
    name: 'mathSolverPrompt',
    input: { schema: MathSolverInputSchema },
    output: { schema: MathSolverOutputSchema },
    prompt: `
        You are a brilliant mathematician and an expert math tutor. Your task is to solve the given math problem and provide a clear, step-by-step solution.

        Problem:
        ---
        {{{problem}}}
        ---

        Your response must include:
        1.  **Problem Type**: Identify the area of mathematics the problem belongs to.
        2.  **Final Answer**: State the final solution clearly. Use LaTeX for formatting if necessary (e.g., \\\\frac{a}{b}, x^2).
        3.  **Step-by-Step Solution**: Provide a detailed, easy-to-follow breakdown of each step required to arrive at the final answer. Explain the reasoning and the mathematical rules applied at each stage. Format this section using Markdown.

        Show all your work and explain your reasoning thoroughly.
    `,
});

const mathSolverFlow = ai.defineFlow(
  {
    name: 'mathSolverFlow',
    inputSchema: MathSolverInputSchema,
    outputSchema: MathSolverOutputSchema,
  },
  async (input) => {
    const { output } = await mathSolverPrompt(input);
    return output!;
  }
);
