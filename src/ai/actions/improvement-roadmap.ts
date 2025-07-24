'use server';

/**
 * @fileOverview This file contains the server action for the improvement roadmap generator.
 */

import { getImprovementRoadmap as getImprovementRoadmapFlow } from '@/ai/flows/improvement-roadmap';
import type { ImprovementRoadmapInput, ImprovementRoadmapOutput } from '@/lib/ai-types';

export async function getImprovementRoadmap(input: ImprovementRoadmapInput): Promise<ImprovementRoadmapOutput> {
  return await getImprovementRoadmapFlow(input);
}
