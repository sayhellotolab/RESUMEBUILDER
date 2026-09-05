export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  photoUrl?: string; // Bonus: profile photo upload
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: string; // Comma separated or list
  url: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100
  category: string; // e.g. Frontend, Backend, Soft Skills
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g. Native, Fluent, Intermediate, Basic
}

export type SectionType = 
  | 'personal'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'languages'
  | 'achievements';

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  sectionsOrder: SectionType[];
}

export type TemplateId = 'professional' | 'modern' | 'minimal';

export type AccentColor = 'indigo' | 'emerald' | 'violet' | 'rose' | 'slate';

export interface CoverLetterData {
  companyName: string;
  hiringManager: string;
  jobTitle: string;
  date: string;
  content: string;
}

export interface ResumeState {
  resumeData: ResumeData;
  coverLetterData: CoverLetterData;
  activeTemplate: TemplateId;
  theme: 'light' | 'dark';
  accentColor: AccentColor;
  activeTab: 'resume' | 'cover-letter';
  
  // Actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateCoverLetter: (data: Partial<CoverLetterData>) => void;
  setActiveTab: (tab: 'resume' | 'cover-letter') => void;
  
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
  
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;
  
  addLanguage: (lang: Omit<Language, 'id'>) => void;
  updateLanguage: (id: string, lang: Partial<Language>) => void;
  deleteLanguage: (id: string) => void;
  
  addAchievement: (ach: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, ach: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  setSectionsOrder: (order: SectionType[]) => void;
  setActiveTemplate: (template: TemplateId) => void;
  setAccentColor: (color: AccentColor) => void;
  toggleTheme: () => void;
  loadResumeData: (data: ResumeData) => void;
  resetResumeData: () => void;
}
