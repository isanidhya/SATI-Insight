
'use server';
/**
 * @fileOverview AI flow for suggesting skills based on a GitHub profile.
 */
import { ai } from '@/ai/genkit';
import {
  SuggestSkillsInputSchema,
  type SuggestSkillsInput,
  SuggestSkillsOutputSchema,
  type SuggestSkillsOutput,
} from '@/lib/ai-types';
import { getGithubRepositories } from '../tools/github-api';
import { z } from 'zod';

export async function suggestSkills(
  input: SuggestSkillsInput
): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: { schema: z.object({ projectDescriptions: z.array(z.string()) }) },
  output: { schema: SuggestSkillsOutputSchema },
  prompt: `You are an expert software engineering mentor. Your task is to analyze a list of project descriptions from a user's GitHub profile and identify the technical skills demonstrated.

  Analyze the following project descriptions:
  {{#each projectDescriptions}}
  - {{{this}}}
  {{/each}}

  Based on this information, identify and list the key technical skills (languages, frameworks, libraries, tools, etc.).

  Your response MUST be a valid JSON object that strictly follows this format:
  {
    "skills": ["<skill_name_1>", "<skill_name_2>", "..."]
  }
  Do not include any other text or explanation in your response.
  `,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async ({ githubUsername }) => {
    try {
      console.log(`Starting suggestSkillsFlow for ${githubUsername}`);
      const projectDescriptions = await getGithubRepositories(
        githubUsername
      );

      if (projectDescriptions.length === 0) {
        console.log('No repository descriptions found. Returning empty skills list.');
        return { skills: [] };
      }
      
      console.log(`Found ${projectDescriptions.length} projects. Now calling AI prompt.`);
      const { output } = await prompt({ projectDescriptions });

      if (!output || !output.skills) {
        console.error('AI did not return the expected skill format. Raw output:', JSON.stringify(output, null, 2));
        throw new Error('The AI returned an invalid or empty response. Please try again.');
      }
      
      console.log('Successfully generated skills:', output.skills);
      return output;
    } catch (error: any) {
      console.error('Error in suggestSkillsFlow:', {
        message: error.message,
        stack: error.stack,
      });
      // Propagate a user-friendly error message.
      throw new Error(`Failed to analyze GitHub profile. The AI model could not process the repository data. Please try again later.`);
    }
  }
);
