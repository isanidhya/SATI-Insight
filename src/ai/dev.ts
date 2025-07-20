import { config } from 'dotenv';
config();

import '@/ai/flows/validate-skills.ts';
import '@/ai/flows/suggest-skills.ts';
import '@/ai/flows/ai-mentor-feedback.ts';