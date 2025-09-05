
'use server';
/**
 * @fileOverview A YouTube video finder AI agent.
 *
 * - findYoutubeVideo - A function that finds a YouTube video ID for a given prompt.
 * - FindYoutubeVideoOutput - The return type for the findYoutubeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindYoutubeVideoOutputSchema = z.object({
  videoId: z.string().describe('The YouTube video ID.'),
});
export type FindYoutubeVideoOutput = z.infer<typeof FindYoutubeVideoOutputSchema>;

export async function findYoutubeVideo(promptText: string): Promise<FindYoutubeVideoOutput> {
  return findYoutubeVideoFlow(promptText);
}

const prompt = ai.definePrompt({
  name: 'findYoutubeVideoPrompt',
  input: {schema: z.string()},
  output: {schema: FindYoutubeVideoOutputSchema},
  prompt: `Find a valid and embeddable YouTube video ID for a video that matches the following description. The video should be calming and suitable for stress relief. Only return the videoId, and nothing else. Ensure the video is not a YouTube Short or from a playlist. Description: {{{input}}}`,
});

const findYoutubeVideoFlow = ai.defineFlow(
  {
    name: 'findYoutubeVideoFlow',
    inputSchema: z.string(),
    outputSchema: FindYoutubeVideoOutputSchema,
  },
  async (promptText) => {
    const {output} = await prompt(promptText);
    return output!;
  }
);
