
'use server';

/**
 * @fileOverview AI mentor that provides personalized feedback and improvement tips to students based on their weekly activity and skills.
 *
 * - getMentorFeedback - A function that generates personalized feedback for a student.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  MentorFeedbackInputSchema,
  type MentorFeedbackInput,
  MentorFeedbackOutputSchema,
  type MentorFeedbackOutput,
} from '@/lib/ai-types';

export async function getMentorFeedback(input: MentorFeedbackInput): Promise<MentorFeedbackOutput> {
  return mentorFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentorFeedbackPrompt',
  input: {schema: MentorFeedbackInputSchema},
  output: {schema: MentorFeedbackOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
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
