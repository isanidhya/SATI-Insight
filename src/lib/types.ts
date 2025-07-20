export interface Skill {
  name: string;
  rating: number; // 1-5
  verified: boolean;
  proof?: string;
}

export interface Project {
  name: string;
  description: string;
  link: string;
}

export interface CreativeWork {
  type: 'video' | 'portfolio' | 'social';
  link: string;
  title: string;
}

export interface User {
  id: number;
  name:string;
  email: string;
  role: 'student' | 'recruiter' | 'admin' | 'mentor';
  academicYear: number;
  avatar: string;
  skills: Skill[];
  projects: Project[];
  creativeZone: CreativeWork[];
  weeklyActivity?: string;
}
