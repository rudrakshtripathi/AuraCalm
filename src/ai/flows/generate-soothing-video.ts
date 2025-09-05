
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
  let {operation} = await ai.generate({
    model: googleAI.model('veo-2.0-generate-001'),
    prompt: promptText,
    config: {
      durationSeconds: 5,
      aspectRatio: '16:9',
    },
  });

  if (!operation) {
    throw new Error('Expected the model to return an operation');
  }

  // Wait until the operation completes.
  while (!operation.done) {
    operation = await ai.checkOperation(operation);
    // Sleep for 5 seconds before checking again.
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  if (operation.error) {
    throw new Error('failed to generate video: ' + operation.error.message);
  }

  const video = operation.output?.message?.content.find(p => !!p.media);
  if (!video || !video.media?.url) {
    throw new Error('Failed to find the generated video');
  }

  // The URL from Veo is temporary and needs the API key.
  // To make it usable in the client, we fetch it and convert to a data URI.
  const fetch = (await import('node-fetch')).default;
  const videoDownloadResponse = await fetch(
    `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }

  const buffer = await videoDownloadResponse.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const contentType = video.media.contentType || 'video/mp4';

  return {
    videoUrl: `data:${contentType};base64,${base64}`,
  };
}
