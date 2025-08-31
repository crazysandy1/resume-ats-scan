export type Page = 'builder' | 'checker';

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phoneNumber: string;
  linkedin: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string;
}

export interface ATSAnalysis {
  score: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestions: string;
}
