/**
 * @fileOverview This file contains all the type definitions and Zod schemas for the AI flows.
 */
import {z} from 'genkit';

// === AI Mentor Feedback Types ===
export const MentorFeedbackInputSchema = z.object({
  weeklyActivity: z
    .string()
    .describe('Description of the student\'s activities during the week.'),
  skills: z.array(z.string()).describe('List of skills the student possesses.'),
});
export type MentorFeedbackInput = z.infer<typeof MentorFeedbackInputSchema>;

export const MentorFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback and improvement tips for the student.'),
});
export type MentorFeedbackOutput = z.infer<typeof MentorFeedbackOutputSchema>;


// === Suggest Skills Types ===
export const SuggestSkillsInputSchema = z.object({
  projectDescriptions: z.array(z.string()).describe('A list of project descriptions.'),
  publicData: z.string().describe('Any public data available about the student.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

export const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z.array(z.string()).describe('A list of suggested skills based on the project descriptions and public data.'),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;


// === Validate Skills Types ===
export const ValidateSkillsInputSchema = z.object({
  skill: z.string().describe('The skill to validate.'),
  proof: z.string().describe('Link to verified project or public data as proof of skill.'),
});
export type ValidateSkillsInput = z.infer<typeof ValidateSkillsInputSchema>;

export const ValidateSkillsOutputSchema = z.object({
  skillRating: z.number().min(1).max(5).describe('A rating from 1 to 5 stars representing the validated skill level.'),
  feedback: z.string().describe('Personalized feedback and improvement tips.'),
});
export type ValidateSkillsOutput = z.infer<typeof ValidateSkillsOutputSchema>;
