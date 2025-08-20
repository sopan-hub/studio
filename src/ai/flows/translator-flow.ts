
'use server';
/**
 * @fileOverview A flow for translating text or documents.
 *
 * - translateText - A function that handles the translation.
 * - TranslatorInput - The input type for the translateText function.
 * - TranslatorOutput - The return type for the translateText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const TranslatorInputSchema = z.object({
  text: z.string().describe("The text to be translated."),
  targetLanguage: z.string().describe("The language to translate the text into (e.g., 'Spanish', 'Japanese', 'French')."),
  sourceLanguage: z.string().optional().describe("The source language of the text. If not provided, it will be auto-detected."),
});
export type TranslatorInput = z.infer<typeof TranslatorInputSchema>;

const TranslatorOutputSchema = z.object({
    translatedText: z.string().describe("The translated text in the target language. Should be formatted to preserve the original's structure (e.g., paragraphs, lists) using Markdown."),
    detectedSourceLanguage: z.string().optional().describe("The source language that was auto-detected, if not provided by the user."),
});
export type TranslatorOutput = z.infer<typeof TranslatorOutputSchema>;

export async function translateText(input: TranslatorInput): Promise<TranslatorOutput> {
  return translatorFlow(input);
}

const translatorPrompt = ai.definePrompt({
    name: 'translatorPrompt',
    input: { schema: TranslatorInputSchema },
    output: { schema: TranslatorOutputSchema },
    prompt: `
        You are a highly skilled, professional translator. Your task is to translate the following text into {{{targetLanguage}}}.

        {{#if sourceLanguage}}
        The source language is {{sourceLanguage}}.
        {{else}}
        Auto-detect the source language.
        {{/if}}

        Translate the text accurately while preserving the original meaning, tone, and formatting as much as possible. Maintain paragraphs, lists, and other structures.

        Text to Translate:
        ---
        {{{text}}}
        ---
    `,
});

const translatorFlow = ai.defineFlow(
  {
    name: 'translatorFlow',
    inputSchema: TranslatorInputSchema,
    outputSchema: TranslatorOutputSchema,
  },
  async (input) => {
    const { output } = await translatorPrompt(input);
    return output!;
  }
);
