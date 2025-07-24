
'use server';
/**
 * @fileOverview AI mentor that provides personalized, conversational advice based on a student's profile and chat history.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { ConversationalMentorInputSchema, MessageSchema } from '@/lib/ai-types';

const mentorPrompt = ai.definePrompt({
  name: 'conversationalMentorPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  system: `You are a helpful and friendly AI Mentor for university students. Your goal is to provide personalized guidance, career advice, and project suggestions.

You have access to the student's profile information. Use this context to make your responses highly relevant and tailored to their specific situation.

Here is the student's profile:
- Name: {{profile.name}}
- Branch: {{profile.branch}}
- Year: {{profile.year}}
- Overall AI-Assessed Rating: {{profile.overallRating}} / 5
- AI-Generated Summary: {{profile.profileSummary}}
- Verified Skills:
{{#each profile.skills}}
  - {{this.name}} (Rating: {{this.rating}}/5, Evidence: {{this.evidence}})
{{/each}}

Engage in a natural, supportive, and encouraging conversation. Keep your responses concise and easy to understand. Use markdown for formatting when appropriate.`,
  input: { schema: ConversationalMentorInputSchema },
  output: { schema: MessageSchema },
});

export const conversationalMentorFlow = ai.defineFlow(
  {
    name: 'conversationalMentorFlow',
    inputSchema: ConversationalMentorInputSchema,
    outputSchema: MessageSchema,
  },
  async ({ profile, history }) => {
    const response = await ai.generate({
      model: mentorPrompt.model,
      prompt: {
        ...mentorPrompt,
        context: { profile },
      },
      history,
    });
    
    return {
        role: 'model',
        content: response.text,
    };
  }
);
