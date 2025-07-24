
'use server';
/**
 * @fileOverview AI mentor that provides personalized, conversational advice based on a student's profile and chat history.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ConversationalMentorInputSchema, MessageSchema, type ConversationalMentorInput } from '@/lib/ai-types';

export const conversationalMentorFlow = ai.defineFlow(
  {
    name: 'conversationalMentorFlow',
    inputSchema: ConversationalMentorInputSchema,
    outputSchema: MessageSchema,
  },
  async ({ profile, history }) => {
    // Manually construct the system prompt with the user's profile data.
    const systemPrompt = `You are a helpful and friendly AI Mentor for university students. Your goal is to provide personalized guidance, career advice, and project suggestions.

You have access to the student's profile information. Use this context to make your responses highly relevant and tailored to their specific situation.

Here is the student's profile:
- Name: ${profile.name || 'N/A'}
- Branch: ${profile.branch || 'N/A'}
- Year: ${profile.year || 'N/A'}
- Overall AI-Assessed Rating: ${profile.overallRating?.toFixed(1) || 'N/A'} / 5
- AI-Generated Summary: ${profile.profileSummary || 'N/A'}
- Verified Skills:
${(profile.skills || [])
  .map(skill => `  - ${skill.name} (Rating: ${skill.rating}/5, Evidence: ${skill.evidence})`)
  .join('\n') || '  No skills listed.'}

Engage in a natural, supportive, and encouraging conversation. Keep your responses concise and easy to understand. Use markdown for formatting when appropriate.`;

    const response = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      system: systemPrompt,
      history,
    });
    
    return {
        role: 'model',
        content: response.text,
    };
  }
);
