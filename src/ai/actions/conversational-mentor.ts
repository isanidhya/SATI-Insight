
'use server';

/**
 * @fileOverview This file contains the server action for the conversational mentor.
 */

import { conversationalMentorFlow } from '@/ai/flows/conversational-mentor';
import type { ConversationalMentorInput, Message } from '@/lib/ai-types';

export async function conversationalMentor(input: ConversationalMentorInput): Promise<Message> {
  return await conversationalMentorFlow(input);
}
