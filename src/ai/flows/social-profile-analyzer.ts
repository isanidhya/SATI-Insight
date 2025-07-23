
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { simpleScraper } from '../tools/simple-scraper';
import { SocialProfileInputSchema, SuggestSkillsOutputSchema, type SocialProfileInput } from '@/lib/ai-types';

const prompt = ai.definePrompt({
  name: 'socialProfilePrompt',
  input: { schema: z.object({ linkedInContent: z.string(), leetCodeContent: z.string() }) },
  output: { schema: SuggestSkillsOutputSchema },
  prompt: `You are a talent evaluator. Analyze the provided LinkedIn and LeetCode profile content and suggest a list of technical skills.

  LinkedIn Profile Content:
  {{{linkedInContent}}}

  LeetCode Profile Content:
  {{{leetCodeContent}}}

  Return a JSON object with a "skills" array.
  `,
});

export const socialProfileAnalyzerFlow = ai.defineFlow(
  {
    name: 'socialProfileAnalyzerFlow',
    inputSchema: SocialProfileInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async ({ linkedinUrl, leetcodeUrl }) => {
    const [linkedInContent, leetCodeContent] = await Promise.all([
      simpleScraper(linkedinUrl || ''),
      simpleScraper(leetcodeUrl || ''),
    ]);

    const { output } = await prompt({ linkedInContent, leetCodeContent });
    return output || { skills: [] };
  }
);

export async function analyzeSocialProfiles(input: SocialProfileInput) {
  return socialProfileAnalyzerFlow(input);
}
