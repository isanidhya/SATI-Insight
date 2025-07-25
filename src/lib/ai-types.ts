
import { z } from 'zod';

/**
 * Defines the schema for a single skill, including its name, rating, and evidence.
 * This is used for the comprehensive skill profile generation.
 */
export const SkillSchema = z.object({
  name: z.string().describe('The name of the skill.'),
  rating: z
    .number()
    .min(1)
    .max(5)
    .describe('The AI-rated proficiency of the skill from 1-5.'),
  evidence: z
    .string()
    .describe('The specific evidence or project that justifies the rating.'),
});

/**
 * Defines the schema for the input of the `suggestSkills` flow.
 * This now takes the user's GitHub username.
 */
export const SuggestSkillsInputSchema = z.object({
  githubUsername: z.string().describe("The user's GitHub username."),
});


/**
 * Defines the schema for the output of the `suggestSkills` flow.
 * It returns a list of suggested skill names.
 */
export const SuggestSkillsOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of suggested skills.'),
});

/**
 * Defines the schema for the input of the `validateSkills` flow.
 * This includes the list of skills to validate and the context from the GitHub profile.
 */
export const ValidateSkillsInputSchema = z.object({
  skills: z.array(z.string()).describe('The list of skills to be validated.'),
  proof: z
    .string()
    .describe('The context (like URLs to profiles) to use for validation.'),
});

/**
 * Defines the schema for the output of the `validateSkills` flow.
 * It returns a validated list of skills with ratings and evidence.
 */
export const ValidateSkillsOutputSchema = z.object({
  validatedSkills: z
    .array(SkillSchema)
    .describe('The list of validated and rated skills.'),
});


/**
 * Defines the schema for the input of the `getMentorFeedback` flow.
 */
export const MentorFeedbackInputSchema = z.object({
    weeklyActivity: z.string().describe("The student's description of their weekly activities."),
    skills: z.array(z.string()).describe("The list of the student's current skills."),
    profileSummary: z.string().describe("The student's AI-generated profile summary."),
});


/**
 * Defines the schema for the output of the `getMentorFeedback` flow.
 */
export const MentorFeedbackOutputSchema = z.object({
    feedback: z.string().describe("The AI mentor's personalized feedback and advice."),
});

// Define the input schema for the onboarding flow
export const OnboardingInputSchema = z.object({
  githubUrl: z.string().url().optional().describe("URL to the user's GitHub profile."),
  linkedinUrl: z.string().url().optional().describe("URL to the user's LinkedIn profile."),
  leetcodeUrl: z.string().url().optional().describe("URL to the user's LeetCode profile."),
});
export type OnboardingInput = z.infer<typeof OnboardingInputSchema>;

// Define the overall output schema for the entire profile analysis
export const OnboardingOutputSchema = z.object({
  skills: z.array(SkillSchema).describe("A list of skills identified and rated from the user's profiles."),
  profileSummary: z.string().describe("A concise summary of the user's professional profile based on the provided links."),
  overallRating: z.number().min(1).max(5).describe("An overall rating of the user's entire profile, considering all skills and experiences."),
});
export type OnboardingOutput = z.infer<typeof OnboardingOutputSchema>;


export const SocialProfileInputSchema = z.object({
  linkedinUrl: z.string().url().optional(),
  leetcodeUrl: z.string().url().optional(),
});

export type SocialProfileInput = z.infer<typeof SocialProfileInputSchema>;

// Conversational Mentor Schemas
export const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

// This is the full user profile schema that the `getStudentProfile` tool will return.
// It is marked as optional because some fields might not exist in Firestore.
export const UserProfileSchema = z.object({
  uid: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  branch: z.string().optional(),
  year: z.number().optional(),
  skills: z.array(SkillSchema).optional(),
  profileSummary: z.string().optional(),
  overallRating: z.number().optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  leetcodeUrl: z.string().url().optional().or(z.literal('')),
  createdAt: z.string().optional(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const ConversationalMentorInputSchema = z.object({
  userId: z.string().describe("The UID of the user initiating the chat."),
  history: z.array(MessageSchema),
});
export type ConversationalMentorInput = z.infer<typeof ConversationalMentorInputSchema>;

// Improvement Roadmap Schemas
export const ImprovementRoadmapInputSchema = z.object({
    name: z.string(),
    year: z.number(),
    branch: z.string(),
    skills: z.array(SkillSchema),
    profileSummary: z.string(),
});
export type ImprovementRoadmapInput = z.infer<typeof ImprovementRoadmapInputSchema>;

export const RoadmapStepSchema = z.object({
    title: z.string().describe("The title of the improvement step."),
    description: z.string().describe("A detailed description of the step and its importance."),
    resources: z.string().describe("Suggested resources, tutorials, or projects to complete the step."),
});

export const ImprovementRoadmapOutputSchema = z.object({
    roadmap: z.array(RoadmapStepSchema),
});
export type ImprovementRoadmapOutput = z.infer<typeof ImprovementRoadmapOutputSchema>;


// Exporting the TypeScript types for use in the application code.
export type Skill = z.infer<typeof SkillSchema>;
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;
export type ValidateSkillsInput = z.infer<typeof ValidateSkillsInputSchema>;
export type ValidateSkillsOutput = z.infer<typeof ValidateSkillsOutputSchema>;
export type MentorFeedbackInput = z.infer<typeof MentorFeedbackInputSchema>;
export type MentorFeedbackOutput = z.infer<typeof MentorFeedbackOutputSchema>;
