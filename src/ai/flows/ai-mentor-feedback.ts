'use server';

/**
 * @fileOverview AI mentor that provides personalized feedback and improvement tips to students based on their weekly activity and skills.
 *
 * - getMentorFeedback - A function that generates personalized feedback for a student.
 * - MentorFeedbackInput - The input type for the getMentorFeedback function.
 * - MentorFeedbackOutput - The return type for the getMentorFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentorFeedbackInputSchema = z.object({
  weeklyActivity: z
    .string()
    .describe('Description of the student\'s activities during the week.'),
  skills: z.array(z.string()).describe('List of skills the student possesses.'),
});
export type MentorFeedbackInput = z.infer<typeof MentorFeedbackInputSchema>;

const MentorFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback and improvement tips for the student.'),
});
export type MentorFeedbackOutput = z.infer<typeof MentorFeedbackOutputSchema>;

export async function getMentorFeedback(input: MentorFeedbackInput): Promise<MentorFeedbackOutput> {
  return mentorFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentorFeedbackPrompt',
  input: {schema: MentorFeedbackInputSchema},
  output: {schema: MentorFeedbackOutputSchema},
  prompt: `You are an AI mentor providing personalized feedback to students based on their weekly activity and skills.

  Provide constructive feedback and improvement tips to help the student enhance their skills and showcase them effectively.

  Weekly Activity: {{{weeklyActivity}}}
  Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  `,
});

const mentorFeedbackFlow = ai.defineFlow(
  {
    name: 'mentorFeedbackFlow',
    inputSchema: MentorFeedbackInputSchema,
    outputSchema: MentorFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
