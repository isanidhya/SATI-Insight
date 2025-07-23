
'use server';
/**
 * @fileOverview This file contains the Genkit flow for validating student skills based on provided proofs.
 *
 * - validateSkills - A function that validates a skill based on proof.
 */
import { ai } from '@/ai/genkit';
import {
  ValidateSkillsInputSchema,
  type ValidateSkillsInput,
  ValidateSkillsOutputSchema,
  type ValidateSkillsOutput,
} from '@/lib/ai-types';


export async function validateSkills(input: ValidateSkillsInput): Promise<ValidateSkillsOutput> {
  return validateSkillsFlow(input);
}

const validateSkillsPrompt = ai.definePrompt({
  name: 'validateSkillsPrompt',
  input: {schema: ValidateSkillsInputSchema},
  output: {schema: ValidateSkillsOutputSchema},
  prompt: `You are an AI skill validator. Your task is to assess a student's skill level based on the evidence they provide and return a JSON object with a rating and personalized feedback.

Here's the information you'll be working with:
- Skills to validate: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Proof (URLs and context): {{{proof}}}

For each skill, analyze the proof to determine a rating from 1 to 5 stars. The evidence for the rating should be a brief justification.

Your response MUST be in the following JSON format:
{
  "validatedSkills": [
    {
      "name": "<skill_name>",
      "rating": <a number from 1 to 5>,
      "evidence": "<Your brief justification for the rating>"
    }
  ]
}
`,
});

const validateSkillsFlow = ai.defineFlow(
  {
    name: 'validateSkillsFlow',
    inputSchema: ValidateSkillsInputSchema,
    outputSchema: ValidateSkillsOutputSchema,
  },
  async input => {
    const {output} = await validateSkillsPrompt(input);
    return output!;
  }
);
