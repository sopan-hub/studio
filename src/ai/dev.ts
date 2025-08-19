import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-notes.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/generate-quizzes.ts';