'use server';

/**
 * @fileOverview AI flow for generating a personalized improvement roadmap for a student.
 * 
 * - getImprovementRoadmap - A function that generates a roadmap based on a student's profile.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { ImprovementRoadmapInputSchema, ImprovementRoadmapOutputSchema, type ImprovementRoadmapInput, type ImprovementRoadmapOutput } from '@/lib/ai-types';

export async function getImprovementRoadmap(input: ImprovementRoadmapInput): Promise<ImprovementRoadmapOutput> {
    return improvementRoadmapFlow(input);
}

const prompt = ai.definePrompt({
    name: 'improvementRoadmapPrompt',
    input: { schema: ImprovementRoadmapInputSchema },
    output: { schema: ImprovementRoadmapOutputSchema },
    model: googleAI.model('gemini-1.5-flash-latest'),
    prompt: `You are a senior software engineering mentor and career coach creating a personalized improvement roadmap for a university student.

    Analyze the student's profile:
    - Name: {{name}}
    - Academic Year: {{year}}
    - Branch: {{branch}}
    - Current Skills:
    {{#each skills}}
    - {{name}} (Rated: {{rating}}/5, Evidence: {{evidence}})
    {{/each}}
    - AI Summary: {{profileSummary}}

    Based on their current skills, academic year, and branch, create a clear, actionable, and encouraging roadmap for the next 3-6 months.
    The roadmap should consist of 3 to 5 concrete steps. Each step should include:
    1. A clear 'title' for the step (e.g., "Master Advanced React Concepts").
    2. A 'description' explaining what to do and why it's important for their career growth.
    3. A 'resources' string suggesting specific tutorials, courses, or types of projects to undertake.

    Tailor the advice to their year. For example, a 1st-year student might get foundational advice, while a 3rd-year student should get advice on specialization and building a strong portfolio for internships.

    Your response must be a valid JSON object following the defined output schema.
    `,
});

const improvementRoadmapFlow = ai.defineFlow(
    {
        name: 'improvementRoadmapFlow',
        inputSchema: ImprovementRoadmapInputSchema,
        outputSchema: ImprovementRoadmapOutputSchema
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);