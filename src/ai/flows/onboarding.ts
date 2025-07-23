
'use server';
/**
 * @fileOverview This file contains the Genkit flow for the user onboarding process.
 * It analyzes user-provided professional profiles to build a comprehensive skill profile.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { scrapeWebsite } from '../tools/web-scraper';
import { OnboardingInputSchema, OnboardingOutputSchema, type OnboardingInput, type OnboardingOutput } from '@/lib/ai-types';

// Define the AI prompt for the onboarding flow
const onboardingPrompt = ai.definePrompt({
    name: 'onboardingPrompt',
    input: { schema: OnboardingInputSchema },
    output: { schema: OnboardingOutputSchema },
    prompt: `You are an expert talent evaluator for a university program. Your task is to analyze a student's online profiles and generate a structured JSON skill profile.

Analyze the following profile information. Use the scrapeWebsite tool to get the content of the URLs.

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
export const analyzeAndBuildProfile = ai.defineFlow(
  {
    name: 'onboardingFlow',
    inputSchema: OnboardingInputSchema,
    outputSchema: OnboardingOutputSchema,
  },
  async (input) => {
    
    let githubContent = '';
    if (input.githubUrl) {
      githubContent = await scrapeWebsite(input.githubUrl);
    }
    
    const { output } = await onboardingPrompt({ ...input, githubUrl: githubContent });
    return output!;
  }
);
