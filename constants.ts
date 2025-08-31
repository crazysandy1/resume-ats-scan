import { ResumeData } from './types';

export const INITIAL_RESUME_DATA: ResumeData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  linkedin: '',
  summary: '',
  experience: [
    {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      responsibilities: ''
    }
  ],
  education: [
    {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      startDate: '',
      endDate: ''
    }
  ],
  skills: ''
};
