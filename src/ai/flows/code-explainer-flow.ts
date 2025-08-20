
'use server';
/**
 * @fileOverview A flow for explaining code snippets.
 *
 * - explainCode - A function that handles explaining code.
 * - CodeExplainerInput - The input type for the explainCode function.
 * - CodeExplainerOutput - The return type for the explainCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CodeExplainerInputSchema = z.object({
  code: z.string().describe("The code snippet to explain."),
  language: z.string().optional().describe("The programming language of the snippet (e.g., 'JavaScript', 'Python'). If not provided, the AI will try to auto-detect it."),
});
export type CodeExplainerInput = z.infer<typeof CodeExplainerInputSchema>;

const CodeExplainerOutputSchema = z.object({
    language: z.string().describe("The detected or provided programming language."),
    summary: z.string().describe("A high-level summary of what the code does."),
    lineByLineExplanation: z.string().describe("A detailed, line-by-line or block-by-block explanation of the code's logic and syntax. Formatted in Markdown."),
});
export type CodeExplainerOutput = z.infer<typeof CodeExplainerOutputSchema>;

export async function explainCode(input: CodeExplainerInput): Promise<CodeExplainerOutput> {
  return codeExplainerFlow(input);
}

const codeExplainerPrompt = ai.definePrompt({
    name: 'codeExplainerPrompt',
    input: { schema: CodeExplainerInputSchema },
    output: { schema: CodeExplainerOutputSchema },
    prompt: `
        You are an expert programmer and code reviewer with a talent for teaching. Your task is to provide a clear and detailed explanation of the following code snippet.

        {{#if language}}
        The code is written in {{language}}.
        {{/if}}

        Code:
        \`\`\`
        {{{code}}}
        \`\`\`

        Your response must include:
        1.  **Language**: The programming language of the code. If it wasn't provided, detect it.
        2.  **Summary**: A brief, high-level overview of the code's purpose and functionality.
        3.  **Line-by-Line Explanation**: A detailed breakdown of the code. Explain what each line or logical block does, including syntax, keywords, and logic. Use Markdown for formatting.

        Be thorough and assume the user is a beginner.
    `,
});

const codeExplainerFlow = ai.defineFlow(
  {
    name: 'codeExplainerFlow',
    inputSchema: CodeExplainerInputSchema,
    outputSchema: CodeExplainerOutputSchema,
  },
  async (input) => {
    const { output } = await codeExplainerPrompt(input);
    return output!;
  }
);
