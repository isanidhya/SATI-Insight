'use server';

/**
 * @fileOverview This file contains the server action for the user onboarding process.
 * It's designed to be called from client components without bundling heavy server-side code.
 */

import { analyzeAndBuildProfile as analyzeAndBuildProfileFlow, type OnboardingInput, type OnboardingOutput } from '@/ai/flows/onboarding';

export async function analyzeAndBuildProfile(input: OnboardingInput): Promise<OnboardingOutput> {
  // This function acts as a wrapper around the Genkit flow,
  // ensuring that the heavy lifting stays on the server.
  return await analyzeAndBuildProfileFlow(input);
}
