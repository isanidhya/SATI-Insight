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
- Skill: {{{skill}}}
- Proof: {{{proof}}}

Carefully analyze the proof and determine a rating from 1 to 5 stars. Also, provide constructive feedback to help the student improve.

Your response MUST be in the following JSON format:
{
  "skillRating": <a number from 1 to 5>,
  "feedback": "<Your detailed feedback and suggestions for improvement>"
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
