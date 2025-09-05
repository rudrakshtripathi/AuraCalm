
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
  videoId: z.string().describe('The YouTube video ID from the provided list.'),
});
export type FindYoutubeVideoOutput = z.infer<typeof FindYoutubeVideoOutputSchema>;

export async function findYoutubeVideo(promptText: string): Promise<FindYoutubeVideoOutput> {
  return findYoutubeVideoFlow(promptText);
}

const availableVideos = [
  { id: 'L_LUpnjgPso', description: 'Peaceful beach with gentle waves and sunset' },
  { id: 'q76bMs-mupI', description: 'Serene forest with sunlight filtering through trees' },
  { id: '2G8LAiHSCAs', description: 'Calm mountain lake with sky reflection' },
  { id: 't2AlVzEyS4c', description: 'Cozy fireplace with crackling sounds' },
  { id: 'q5B4L2P3oY0', description: 'Lush green nature scenes with relaxing music' },
  { id: 'h2insFY-20A', description: 'Gentle rain sounds for sleeping' },
  { id: 'qYg1iRBWj3I', description: 'Beautiful lavender fields in Provence, France' }
];

const videoListForPrompt = availableVideos.map(v => `- ${v.id}: ${v.description}`).join('\n');

const prompt = ai.definePrompt({
  name: 'findYoutubeVideoPrompt',
  input: {schema: z.string()},
  output: {schema: FindYoutubeVideoOutputSchema},
  prompt: `From the following list of available YouTube videos, choose the ONE video that best matches the user's request. Respond with only the videoId of your choice.

Available Videos:
${videoListForPrompt}

User Request: {{{input}}}`,
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
