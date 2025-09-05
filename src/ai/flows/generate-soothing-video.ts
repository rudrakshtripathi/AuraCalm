
'use server';
/**
 * @fileOverview A soothing video generation AI agent.
 *
 * - generateSoothingVideo - A function that handles the video generation process.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import type {GenerateSoothingVideoOutput} from '@/ai/schemas/video';

export async function generateSoothingVideo(promptText: string): Promise<GenerateSoothingVideoOutput> {
  const {media} = await ai.generate({
    model: googleAI.model('gemini-2.5-flash'),
    prompt: `Generate an image that represents a short, looping, soothing video based on this description: ${promptText}. The image should be serene and calming.`,
  });

  if (!media || !media.url) {
    throw new Error('Failed to find the generated video');
  }

  // The URL is already a data URI with this model
  return {
    videoUrl: media.url,
  };
}
