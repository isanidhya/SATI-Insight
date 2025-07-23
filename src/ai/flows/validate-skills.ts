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
  prompt: `You are an AI skill validator. Rate the student's skill from 1 to 5 stars based on the provided proof. Provide personalized feedback and improvement tips.

Skill: {{{skill}}}
Proof: {{{proof}}}
Rating (1-5 stars):`,
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
