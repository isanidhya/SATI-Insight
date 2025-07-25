
'use server';
/**
 * @fileOverview AI mentor that provides personalized, conversational advice based on a student's profile and chat history using a tool-based approach.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ConversationalMentorInputSchema, MessageSchema } from '@/lib/ai-types';
import { getStudentProfileTool } from '../tools/student-profile-tool';

export const conversationalMentorFlow = ai.defineFlow(
  {
    name: 'conversationalMentorFlow',
    inputSchema: ConversationalMentorInputSchema,
    outputSchema: MessageSchema,
  },
  async ({ userId, history }) => {
    // The system prompt now instructs the AI on its personality and what tools it has.
    // It no longer needs the full user profile data upfront.
    const systemPrompt = `You are a helpful and friendly AI Mentor for university students. Your goal is to provide personalized guidance, career advice, and project suggestions.

You have access to a tool called 'getStudentProfile' which you can use to fetch the student's complete profile, including their skills, academic year, branch, and links to their work.

ALWAYS use the 'getStudentProfile' tool with the provided userId BEFORE answering any question that requires personal context, such as giving advice, suggesting projects, or analyzing skills. Do not ask the user for this information; retrieve it yourself using the tool.

Engage in a natural, supportive, and encouraging conversation. Keep your responses concise and easy to understand. Use markdown for formatting when appropriate.`;

    const response = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      system: systemPrompt,
      history,
      tools: [getStudentProfileTool],
      // We pass the userId here so the tool has access to it when called by the AI.
      toolRequestContext: { userId },
    });
    
    const responseText = response.text;
    if (!responseText) {
        return {
            role: 'model',
            content: "I'm sorry, I couldn't generate a response. Could you please try rephrasing your question?",
        };
    }

    return {
        role: 'model',
        content: responseText,
    };
  }
);
