
'use server';
/**
 * @fileOverview This file contains the Genkit flow for the user onboarding process.
 * It analyzes user-provided professional profiles to build a comprehensive skill profile.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { OnboardingInputSchema, OnboardingOutputSchema } from '@/lib/ai-types';
import { getGithubRepositories } from '../tools/github-api';
import { simpleScraper } from '../tools/simple-scraper';
import { googleAI } from '@genkit-ai/googleai';

// Define the tools the AI can use.
const getGithubRepositoriesTool = ai.defineTool(
    {
      name: 'getGithubRepositories',
      description: 'Fetches repository names and descriptions for a given GitHub username. Does not require an access token for public data.',
      inputSchema: z.object({ githubUsername: z.string() }),
      outputSchema: z.array(z.string()),
    },
    async ({ githubUsername }) => getGithubRepositories(githubUsername)
  );

const scrapeWebsiteTool = ai.defineTool(
    {
        name: 'scrapeWebsite',
        description: 'Scrapes a website and returns its text content.',
        inputSchema: z.object({ url: z.string() }),
        outputSchema: z.string(),
    },
    async ({ url }) => simpleScraper(url)
  );

// Define the AI prompt for the onboarding flow
const onboardingPrompt = ai.definePrompt({
    name: 'onboardingPrompt',
    input: { schema: OnboardingInputSchema },
    output: { schema: OnboardingOutputSchema },
    tools: [getGithubRepositoriesTool, scrapeWebsiteTool],
    model: googleAI.model('gemini-1.5-flash-latest'),
    prompt: `You are an expert talent evaluator for a university program. Your task is to analyze a student's online profiles and generate a structured JSON skill profile.

You have access to tools that can fetch data from GitHub and other websites. Use them to gather information based on the URLs provided.

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
    const { output } = await onboardingPrompt(input);
    return output!;
  }
);
