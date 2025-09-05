'use server';
/**
 * @fileOverview A vocal tone analysis AI agent using Google Gemini API.
 *
 * - analyzeVocalTone - A function that handles the vocal tone analysis process.
 * - AnalyzeVocalToneInput - The input type for the analyzeVocalTone function.
 * - AnalyzeVocalToneOutput - The return type for the analyzeVocalTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVocalToneInputSchema = z.object({
  transcribedText: z
    .string()
    .describe("The transcribed text from the user's speech."),
});
export type AnalyzeVocalToneInput = z.infer<typeof AnalyzeVocalToneInputSchema>;

const AnalyzeVocalToneOutputSchema = z.object({
  stressScore:
    z
      .number()
      .describe(
        'A number between 0 (calm) and 100 (extremely stressed) indicating the stress level.'
      ),
  feedback:
    z
      .string()
      .describe('A one-sentence string providing feedback on the user audio.'),
});
export type AnalyzeVocalToneOutput = z.infer<typeof AnalyzeVocalToneOutputSchema>;

export async function analyzeVocalTone(input: AnalyzeVocalToneInput): Promise<AnalyzeVocalToneOutput> {
  return analyzeVocalToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeVocalTonePrompt',
  input: {schema: AnalyzeVocalToneInputSchema},
  output: {schema: AnalyzeVocalToneOutputSchema},
  prompt: `Analyze the following spoken text for signs of psychological stress, anxiety, or urgency. Focus on vocal tone characteristics that would be present in the transcription, like pace, repetition, and word choice. Respond in a strict JSON format: { "stressScore": a number between 0 (calm) and 100 (extremely stressed), "feedback": a one-sentence string providing the insight } Text to analyze: {{{transcribedText}}}`,
});

const analyzeVocalToneFlow = ai.defineFlow(
  {
    name: 'analyzeVocalToneFlow',
    inputSchema: AnalyzeVocalToneInputSchema,
    outputSchema: AnalyzeVocalToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
