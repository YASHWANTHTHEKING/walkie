// This is an autogenerated file from Firebase Studio.

'use server';

/**
 * @fileOverview Reduces background noise in audio recordings using AI.
 *
 * - reduceNoise - A function that handles the noise reduction process.
 * - ReduceNoiseInput - The input type for the reduceNoise function.
 * - ReduceNoiseOutput - The return type for the reduceNoise function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ReduceNoiseInputSchema = z.object({
  audioUrl: z.string().describe('The URL of the audio recording.'),
});
export type ReduceNoiseInput = z.infer<typeof ReduceNoiseInputSchema>;

const ReduceNoiseOutputSchema = z.object({
  reducedNoiseAudioUrl: z
    .string()
    .describe('The URL of the audio recording with reduced noise.'),
});
export type ReduceNoiseOutput = z.infer<typeof ReduceNoiseOutputSchema>;

export async function reduceNoise(input: ReduceNoiseInput): Promise<ReduceNoiseOutput> {
  return reduceNoiseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reduceNoisePrompt',
  input: {
    schema: z.object({
      audioUrl: z.string().describe('The URL of the audio recording.'),
    }),
  },
  output: {
    schema: z.object({
      reducedNoiseAudioUrl:
        z.string().describe('The URL of the audio recording with reduced noise.'),
    }),
  },
  prompt: `You are an audio engineer specializing in noise reduction.

  You will take the audio recording at the URL provided, filter out background noise, and respond with a URL of the noise reduced audio.
  Respond with the URL of the processed audio in the 'reducedNoiseAudioUrl' field.

  Audio URL: {{audioUrl}}`,
});

const reduceNoiseFlow = ai.defineFlow<
  typeof ReduceNoiseInputSchema,
  typeof ReduceNoiseOutputSchema
>(
  {
    name: 'reduceNoiseFlow',
    inputSchema: ReduceNoiseInputSchema,
    outputSchema: ReduceNoiseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
