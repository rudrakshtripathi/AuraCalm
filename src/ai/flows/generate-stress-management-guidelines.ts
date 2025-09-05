'use server';
/**
 * @fileOverview A stress management guideline generation AI agent using Google Gemini API.
 *
 * - generateStressManagementGuidelines - A function that handles the guideline generation process.
 * - GenerateStressManagementGuidelinesInput - The input type for the generateStressManagementGuidelines function.
 * - GenerateStressManagementGuidelinesOutput - The return type for the generateStressManagementGuidelines function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStressManagementGuidelinesInputSchema = z.object({
  stressScore: z
    .number()
    .describe("The stress score derived from the user's speech."),
});
export type GenerateStressManagementGuidelinesInput = z.infer<typeof GenerateStressManagementGuidelinesInputSchema>;

const GenerateStressManagementGuidelinesOutputSchema = z.object({
  guidelines: z
    .array(z.string())
    .describe('A list of personalized stress management guidelines.'),
});
export type GenerateStressManagementGuidelinesOutput = z.infer<typeof GenerateStressManagementGuidelinesOutputSchema>;

export async function generateStressManagementGuidelines(input: GenerateStressManagementGuidelinesInput): Promise<GenerateStressManagementGuidelinesOutput> {
  return generateStressManagementGuidelinesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStressManagementGuidelinesPrompt',
  input: {schema: GenerateStressManagementGuidelinesInputSchema},
  output: {schema: GenerateStressManagementGuidelinesOutputSchema},
  prompt: `Based on the user's stress score of {{{stressScore}}}, generate 3 personalized and actionable stress management guidelines. These guidelines should be concise and easy to follow. Respond with a JSON object containing a "guidelines" array of strings.`,
});

const generateStressManagementGuidelinesFlow = ai.defineFlow(
  {
    name: 'generateStressManagementGuidelinesFlow',
    inputSchema: GenerateStressManagementGuidelinesInputSchema,
    outputSchema: GenerateStressManagementGuidelinesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
