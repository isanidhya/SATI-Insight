// This file contains the Genkit flow for validating student skills based on provided proofs.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateSkillsInputSchema = z.object({
  skill: z.string().describe('The skill to validate.'),
  proof: z.string().describe('Link to verified project or public data as proof of skill.'),
});
export type ValidateSkillsInput = z.infer<typeof ValidateSkillsInputSchema>;

const ValidateSkillsOutputSchema = z.object({
  skillRating: z.number().min(1).max(5).describe('A rating from 1 to 5 stars representing the validated skill level.'),
  feedback: z.string().describe('Personalized feedback and improvement tips.'),
});
export type ValidateSkillsOutput = z.infer<typeof ValidateSkillsOutputSchema>;

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
