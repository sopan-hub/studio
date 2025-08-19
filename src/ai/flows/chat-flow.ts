
'use server';
/**
 * @fileOverview A simple AI chat flow.
 *
 * - chat - A function that handles the chat process.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatInputSchema = z.object({
  question: z.string().describe('The user\'s question.'),
  fileDataUri: z.string().optional().describe(
    "An optional file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

export type ChatInput = z.infer<typeof ChatInputSchema>;
export type ChatOutput = string;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    
    const prompt = `
      You are an expert AI assistant. Answer the user's question. 
      If a file is provided, use its content as the primary context for your answer.

      Question: {{{question}}}

      {{#if fileDataUri}}
      File Content:
      {{media url=fileDataUri}}
      {{/if}}
    `;

    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.0-flash',
      config: {
        temperature: 0.5,
      },
      input: {
        question: input.question,
        fileDataUri: input.fileDataUri,
      }
    });

    return llmResponse.text;
  }
);
