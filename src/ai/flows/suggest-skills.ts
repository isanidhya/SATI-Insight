// src/ai/flows/suggest-skills.ts
'use server';
/**
 * @fileOverview AI flow for suggesting skills based on project descriptions and public data.
 *
 * - suggestSkills - A function that suggests skills based on project descriptions and public data.
 * - SuggestSkillsInput - The input type for the suggestSkills function.
 * - SuggestSkillsOutput - The return type for the suggestSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsInputSchema = z.object({
  projectDescriptions: z.array(z.string()).describe('A list of project descriptions.'),
  publicData: z.string().describe('Any public data available about the student.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z.array(z.string()).describe('A list of suggested skills based on the project descriptions and public data.'),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: {schema: SuggestSkillsInputSchema},
  output: {schema: SuggestSkillsOutputSchema},
  prompt: `You are an AI assistant that suggests skills based on project descriptions and public data.

  Analyze the following project descriptions and public data to suggest a list of skills the student might have.

  Project Descriptions:
  {{#each projectDescriptions}}
  - {{{this}}}
  {{/each}}

  Public Data:
  {{{publicData}}}

  Suggest skills that are relevant to the project descriptions and public data. Only return an array of strings.
  `,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
