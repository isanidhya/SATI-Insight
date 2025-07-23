'use server';
/**
 * @fileOverview This file contains the Genkit flow for the user onboarding process.
 * It analyzes user-provided professional profiles to build a comprehensive skill profile.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema for the onboarding flow
export const OnboardingInputSchema = z.object({
  githubUrl: z.string().url().optional().describe('URL to the user's GitHub profile.'),
  linkedinUrl: z.string().url().optional().describe('URL to the user's LinkedIn profile.'),
  leetcodeUrl: z.string().url().optional().describe('URL to the user's LeetCode profile.'),
});
export type OnboardingInput = z.infer<typeof OnboardingInputSchema>;

// Define the output schema for a single skill, including rating and evidence
const SkillProfileSchema = z.object({
    name: z.string().describe("The name of the skill."),
    rating: z.number().min(1).max(5).describe("The AI-rated proficiency of the skill from 1-5."),
    evidence: z.string().describe("The specific evidence or project that justifies the rating."),
});

// Define the overall output schema for the entire profile analysis
export const OnboardingOutputSchema = z.object({
  skills: z.array(SkillProfileSchema).describe("A list of skills identified and rated from the user's profiles."),
  profileSummary: z.string().describe("A concise summary of the user's professional profile based on the provided links."),
  overallRating: z.number().min(1).max(5).describe("An overall rating of the user's entire profile, considering all skills and experiences."),
});
export type OnboardingOutput = z.infer<typeof OnboardingOutputSchema>;

// Define the AI prompt for the onboarding flow
const onboardingPrompt = ai.definePrompt({
    name: 'onboardingPrompt',
    input: { schema: OnboardingInputSchema },
    output: { schema: OnboardingOutputSchema },
    prompt: `You are an expert talent evaluator for a university program. Your task is to analyze a student's online profiles and generate a structured JSON skill profile.

Analyze the following profile information. NOTE: You do not have the ability to click links, so you must infer the skills and experience based on the URLs and any provided context.

- GitHub Profile: {{{githubUrl}}}
- LinkedIn Profile: {{{linkedinUrl}}}
- LeetCode Profile: {{{leetcodeUrl}}}

Based on the information, perform the following actions:
1.  **Identify Skills**: Detect technical skills (e.g., "TypeScript", "Python", "React", "Docker").
2.  **Rate Skills**: For each skill, assign a proficiency rating from 1 (Beginner) to 5 (Expert). The rating should be based on the likely complexity and number of projects or experiences shown.
3.  **Provide Evidence**: Briefly state the reason for each rating (e.g., "Found in multiple full-stack projects on GitHub," "Listed as a core skill on LinkedIn").
4.  **Write a Summary**: Compose a 2-3 sentence professional summary of the student's key strengths.
5.  **Give an Overall Rating**: Assign an overall profile rating from 1 to 5, representing your holistic assessment of their readiness for internships or advanced projects.

Your final output must be a single, valid JSON object that strictly follows the defined output schema. Do not include any text or formatting outside of the JSON object.`,
});

// Define the main flow function
const onboardingFlow = ai.defineFlow(
  {
    name: 'onboardingFlow',
    inputSchema: OnboardingInputSchema,
    outputSchema: OnboardingOutputSchema,
  },
  async (input) => {
    // NOTE: In a real-world scenario, you would first use a tool to scrape the content
    // of the provided URLs. Since we can't do that here, the AI will infer from the URLs.
    
    const { output } = await onboardingPrompt(input);
    return output!;
  }
);

// This is the main function that will be called from the signup page.
export async function analyzeAndBuildProfile(input: OnboardingInput): Promise<OnboardingOutput> {
  console.log("AI Onboarding Flow Triggered with input:", input);
  return await onboardingFlow(input);
}
