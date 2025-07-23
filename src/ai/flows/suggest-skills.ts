'use server';
/**
 * @fileOverview AI flow for suggesting skills based on project descriptions and public data.
 *
 * - suggestSkills - A function that suggests skills based on project descriptions and public data.
 */

import { ai } from '@/ai/genkit';
import {
  SuggestSkillsInputSchema,
  type SuggestSkillsInput,
  SuggestSkillsOutputSchema,
  type SuggestSkillsOutput,
} from '@/lib/ai-types';


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
