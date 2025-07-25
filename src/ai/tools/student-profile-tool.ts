
'use server';
/**
 * @fileOverview A Genkit tool for fetching a student's profile from Firestore.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfileSchema } from '@/lib/ai-types';

/**
 * Defines a tool that allows the AI to fetch the full profile of the currently authenticated user.
 * This is more efficient and powerful than passing the entire profile in a system prompt,
 * as the AI can decide when it needs to retrieve this information.
 */
export const getStudentProfileTool = ai.defineTool(
  {
    name: 'getStudentProfile',
    description: "Retrieves the full profile of the student currently interacting with the AI. Use this to get context about the student's skills, year, branch, and professional links before providing personalized advice.",
    inputSchema: z.object({
      userId: z.string().describe("The UID of the student whose profile needs to be fetched."),
    }),
    outputSchema: UserProfileSchema,
  },
  async ({ userId }) => {
    console.log(`[Tool] Fetching profile for user: ${userId}`);
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error(`[Tool] No profile found for user: ${userId}`);
        throw new Error('User profile not found.');
      }

      const profileData = userDoc.data();
      
      // Ensure the UID is part of the returned data
      const response = {
          ...profileData,
          uid: userId,
      } as z.infer<typeof UserProfileSchema>;
      
      // Validate data against the schema before returning
      return UserProfileSchema.parse(response);

    } catch (error) {
      console.error(`[Tool] Error fetching profile for user ${userId}:`, error);
      // It's better to throw an error to let the AI know the tool failed.
      throw new Error('Failed to retrieve student profile from the database.');
    }
  }
);
