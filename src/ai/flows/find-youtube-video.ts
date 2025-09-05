
'use server';
/**
 * @fileOverview A YouTube video finder AI agent.
 *
 * - findYoutubeVideo - A function that finds a YouTube video ID for a given prompt.
 * - FindYoutubeVideoOutput - The return type for the findYoutubeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { availableVideos } from './youtube-videos';

const FindYoutubeVideoOutputSchema = z.object({
  videoDescription: z.string().describe(`The full description of the most relevant video from the list. Must be one of: ${availableVideos.map(v => `"${v.description}"`).join(', ')}`),
});
export type FindYoutubeVideoOutput = z.infer<typeof FindYoutubeVideoOutputSchema>;

export async function findYoutubeVideo(promptText: string): Promise<FindYoutubeVideoOutput> {
  return findYoutubeVideoFlow(promptText);
}

const videoListForPrompt = availableVideos.map(v => `- Description: ${v.description}`).join('\n');

const prompt = ai.definePrompt({
  name: 'findYoutubeVideoPrompt',
  input: {schema: z.string()},
  output: {schema: FindYoutubeVideoOutputSchema},
  prompt: `You are an expert at selecting the perfect calming video. Your task is to analyze the user's request and choose the single best video from the list below that matches their desired scene.

Consider keywords, themes, and the overall mood of the request.

Available Videos:
${videoListForPrompt}

User Request: "{{{input}}}"

Based on the user's request, which video is the most accurate match? Respond with only the full description for your choice in the videoDescription field.`,
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
