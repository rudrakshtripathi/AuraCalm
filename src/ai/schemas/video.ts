import {z} from 'genkit';

export const GenerateSoothingVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type GenerateSoothingVideoOutput = z.infer<typeof GenerateSoothingVideoOutputSchema>;
