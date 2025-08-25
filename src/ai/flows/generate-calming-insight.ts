'use server';
/**
 * @fileOverview A calming insight generation AI agent using Google Gemini API.
 *
 * - generateCalmingInsight - A function that handles the calming insight generation process.
 * - GenerateCalmingInsightInput - The input type for the generateCalmingInsight function.
 * - GenerateCalmingInsightOutput - The return type for the generateCalmingInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCalmingInsightInputSchema = z.object({
  transcribedText: z
    .string()
    .describe("The transcribed text from the user's speech."),
  stressScore: z
    .number()
    .describe("The stress score derived from the user's speech."),
});
export type GenerateCalmingInsightInput = z.infer<typeof GenerateCalmingInsightInputSchema>;

const GenerateCalmingInsightOutputSchema = z.object({
  calmingInsight: z
    .string()
    .describe('A personalized calming insight based on the detected stress patterns.'),
});
export type GenerateCalmingInsightOutput = z.infer<typeof GenerateCalmingInsightOutputSchema>;

export async function generateCalmingInsight(input: GenerateCalmingInsightInput): Promise<GenerateCalmingInsightOutput> {
  return generateCalmingInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCalmingInsightPrompt',
  input: {schema: GenerateCalmingInsightInputSchema},
  output: {schema: GenerateCalmingInsightOutputSchema},
  prompt: `Based on the user's transcribed text and stress score, generate a personalized calming insight. The insight should help the user understand the reasons for their detected stress and offer a positive perspective. Respond in a single sentence. Text to analyze: {{{transcribedText}}}, Stress Score: {{{stressScore}}}`,
});

const generateCalmingInsightFlow = ai.defineFlow(
  {
    name: 'generateCalmingInsightFlow',
    inputSchema: GenerateCalmingInsightInputSchema,
    outputSchema: GenerateCalmingInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
