import { create } from 'zustand';
import type { ResumeData, ResumeState, Experience, Education, Project, Skill, Certification, Language, Achievement, SectionType, TemplateId, AccentColor, CoverLetterData } from '../types';

const INITIAL_SECTIONS_ORDER: SectionType[] = [
  'personal',
  'experience',
  'education',
  'projects',
  'skills',
  'certifications',
  'languages',
  'achievements',
];

const DEFAULT_COVER_LETTER_DATA: CoverLetterData = {
  companyName: 'Stripe Inc.',
  hiringManager: 'Hiring Committee',
  jobTitle: 'Senior Frontend Engineer',
  date: '2026-06-24',
  content: `Dear Hiring Committee,\n\nI am writing to express my enthusiastic interest in the Senior Frontend Engineer position at Stripe Inc. With over 6 years of experience building responsive, performant, and visual web applications, I am confident that my skills align perfectly with Stripe's focus on technical excellence and elegant user interfaces.\n\nIn my previous role as Senior Frontend Engineer at Tech Corp Inc., I led the frontend architecture redesign, which successfully reduced page load times by 35% and increased our active user base by 20%. I have deep proficiency in React, TypeScript, and Tailwind CSS, and I pride myself on crafting clean, maintainable, and type-safe systems.\n\nI admire Stripe's developer-first products and design aesthetics, and I would love the opportunity to contribute to your engineering team. Thank you for your time and consideration. I look forward to discussing how my experience can support Stripe's goals.\n\nSincerely,\nJohn Doe`
};

const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    professionalTitle: 'Lead Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    portfolio: 'johndoe.dev',
    summary: 'Innovative and results-driven Software Engineer with 6+ years of experience specializing in building highly scalable React applications. Proven track record of improving page speeds by 40% and leading cross-functional teams in agile settings.',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Corp Inc.',
      position: 'Senior Frontend Engineer',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: '',
      current: true,
      description: 'Spearheaded frontend redesign using React and Tailwind CSS, resulting in a 35% decrease in load times and a 20% increase in monthly active users. Mentored 4 junior developers and established CI/CD automation pipelines for faster code releases.',
    },
    {
      id: 'exp-2',
      company: 'Digital Solutions LLC',
      position: 'Software Developer',
      location: 'Boston, MA',
      startDate: '2020-06',
      endDate: '2022-12',
      current: false,
      description: 'Developed and maintained RESTful APIs using Node.js and Express. Integrated PostgreSQL databases, optimizing query performance by 15%. Supported frontend teams with state-management components using Redux.',
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2016-09',
      endDate: '2020-05',
      current: false,
      description: 'Graduated with Honors. Coursework focused on Software Engineering, Data Structures, and Database Management Systems.',
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'E-Commerce Analytics Dashboard',
      role: 'Creator & Lead Developer',
      description: 'Built a real-time tracking interface for small merchants. Visualized sales logs, item clicks, and user trends.',
      technologies: 'React, TypeScript, Tailwind CSS, Recharts, Zustand',
      url: 'github.com/johndoe/ecommerce-analytics',
    }
  ],
  skills: [
    { id: 'skill-1', name: 'React / Next.js', level: 95, category: 'Frontend' },
    { id: 'skill-2', name: 'TypeScript', level: 90, category: 'Frontend' },
    { id: 'skill-3', name: 'Node.js', level: 85, category: 'Backend' },
    { id: 'skill-4', name: 'SQL & Database Design', level: 80, category: 'Backend' },
    { id: 'skill-5', name: 'Docker', level: 75, category: 'DevOps' },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: '2024-02',
      url: 'aws.amazon.com',
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Conversational' },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'First Place Winner at HackSF Hackathon',
      description: 'Led a team of 4 to design and present a AI-based energy conservation application within 36 hours.',
      date: '2023-10',
    }
  ],
  sectionsOrder: INITIAL_SECTIONS_ORDER,
};

// Storage helper keys
const STORAGE_KEY = 'resume-builder-state-v1';

interface StoreState extends ResumeState {
  past: ResumeData[];
  future: ResumeData[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useResumeStore = create<StoreState>((set, get) => {
  // Load initial data from localStorage if exists, otherwise fallback to default mock data
  let savedState: any = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      savedState = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  const initialResumeData = savedState?.resumeData || DEFAULT_RESUME_DATA;
  const initialCoverLetterData = savedState?.coverLetterData || DEFAULT_COVER_LETTER_DATA;
  const initialTemplate = savedState?.activeTemplate || 'professional';
  const initialTheme = savedState?.theme || 'dark';
  const initialAccent = savedState?.accentColor || 'indigo';

  // Apply dark mode class to HTML root on load
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    if (initialTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // Helper to persist current state to localStorage and update undo history
  const saveState = (
    resumeData: ResumeData, 
    coverLetterData: CoverLetterData,
    activeTemplate: TemplateId, 
    theme: 'light' | 'dark', 
    accentColor: AccentColor
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ resumeData, coverLetterData, activeTemplate, theme, accentColor })
      );
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  };

  const pushToHistory = (newResumeData: ResumeData) => {
    const { past, resumeData } = get();
    // Cap history length at 25 items
    const newPast = [...past, resumeData].slice(-25);
    set({
      past: newPast,
      future: [],
      resumeData: newResumeData,
      canUndo: true,
      canRedo: false,
    });
    const state = get();
    saveState(state.resumeData, state.coverLetterData, state.activeTemplate, state.theme, state.accentColor);
  };

  return {
    resumeData: initialResumeData,
    coverLetterData: initialCoverLetterData,
    activeTemplate: initialTemplate,
    theme: initialTheme,
    accentColor: initialAccent,
    activeTab: 'resume',
    past: [],
    future: [],
    canUndo: false,
    canRedo: false,

    // Undo / Redo Actions
    undo: () => {
      const { past, future, resumeData } = get();
      if (past.length === 0) return;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      const newFuture = [resumeData, ...future];

      set({
        past: newPast,
        future: newFuture,
        resumeData: previous,
        canUndo: newPast.length > 0,
        canRedo: true,
      });

      saveState(previous, get().coverLetterData, get().activeTemplate, get().theme, get().accentColor);
    },

    redo: () => {
      const { past, future, resumeData } = get();
      if (future.length === 0) return;

      const next = future[0];
      const newFuture = future.slice(1);
      const newPast = [...past, resumeData];

      set({
        past: newPast,
        future: newFuture,
        resumeData: next,
        canUndo: true,
        canRedo: newFuture.length > 0,
      });

      saveState(next, get().coverLetterData, get().activeTemplate, get().theme, get().accentColor);
    },

    // Personal Info Action
    updatePersonalInfo: (info) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        personalInfo: { ...resumeData.personalInfo, ...info },
      };
      pushToHistory(updated);
    },

    updateCoverLetter: (data) => {
      const updated = { ...get().coverLetterData, ...data };
      set({ coverLetterData: updated });
      saveState(get().resumeData, updated, get().activeTemplate, get().theme, get().accentColor);
    },

    setActiveTab: (tab) => {
      set({ activeTab: tab });
    },

    // Work Experience Actions
    addExperience: (exp) => {
      const { resumeData } = get();
      const newExp: Experience = { ...exp, id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
      const updated = {
        ...resumeData,
        experience: [...resumeData.experience, newExp],
      };
      pushToHistory(updated);
    },

    updateExperience: (id, exp) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        experience: resumeData.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
      };
      pushToHistory(updated);
    },

    deleteExperience: (id) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        experience: resumeData.experience.filter((e) => e.id !== id),
      };
      pushToHistory(updated);
    },

    // Education Actions
    addEducation: (edu) => {
      const { resumeData } = get();
      const newEdu: Education = { ...edu, id: `edu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
      const updated = {
        ...resumeData,
        education: [...resumeData.education, newEdu],
      };
      pushToHistory(updated);
    },

    updateEducation: (id, edu) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        education: resumeData.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
      };
      pushToHistory(updated);
    },

    deleteEducation: (id) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        education: resumeData.education.filter((e) => e.id !== id),
      };
      pushToHistory(updated);
    },

    // Projects Actions
    addProject: (proj) => {
      const { resumeData } = get();
      const newProj: Project = { ...proj, id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
      const updated = {
        ...resumeData,
        projects: [...resumeData.projects, newProj],
      };
      pushToHistory(updated);
    },

    updateProject: (id, proj) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        projects: resumeData.projects.map((p) => (p.id === id ? { ...p, ...proj } : p)),
      };
      pushToHistory(updated);
    },

    deleteProject: (id) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        projects: resumeData.projects.filter((p) => p.id !== id),
      };
      pushToHistory(updated);
    },

    // Skills Actions
    addSkill: (skill) => {
      const { resumeData } = get();
      const newSkill: Skill = { ...skill, id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
      const updated = {
        ...resumeData,
        skills: [...resumeData.skills, newSkill],
      };
      pushToHistory(updated);
    },

    updateSkill: (id, skill) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        skills: resumeData.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
      };
      pushToHistory(updated);
    },

    deleteSkill: (id) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        skills: resumeData.skills.filter((s) => s.id !== id),
      };
      pushToHistory(updated);
    },

    // Certifications Actions
    addCertification: (cert) => {
      const { resumeData } = get();
      const newCert: Certification = { ...cert, id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
      const updated = {
        ...resumeData,
        certifications: [...resumeData.certifications, newCert],
      };
      pushToHistory(updated);
    },

    updateCertification: (id, cert) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        certifications: resumeData.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)),
      };
      pushToHistory(updated);
    },

    deleteCertification: (id) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        certifications: resumeData.certifications.filter((c) => c.id !== id),
      };
      pushToHistory(updated);
    },

    // Languages Actions
    addLanguage: (lang) => {
      const { resumeData } = get();
      const newLang: Language = { ...lang, id: `lang-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
      const updated = {
        ...resumeData,
        languages: [...resumeData.languages, newLang],
      };
      pushToHistory(updated);
    },

    updateLanguage: (id, lang) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        languages: resumeData.languages.map((l) => (l.id === id ? { ...l, ...lang } : l)),
      };
      pushToHistory(updated);
    },

    deleteLanguage: (id) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        languages: resumeData.languages.filter((l) => l.id !== id),
      };
      pushToHistory(updated);
    },

    // Achievements Actions
    addAchievement: (ach) => {
      const { resumeData } = get();
      const newAch: Achievement = { ...ach, id: `ach-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` };
      const updated = {
        ...resumeData,
        achievements: [...resumeData.achievements, newAch],
      };
      pushToHistory(updated);
    },

    updateAchievement: (id, ach) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        achievements: resumeData.achievements.map((a) => (a.id === id ? { ...a, ...ach } : a)),
      };
      pushToHistory(updated);
    },

    deleteAchievement: (id) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        achievements: resumeData.achievements.filter((a) => a.id !== id),
      };
      pushToHistory(updated);
    },

    // Layout configuration Actions
    setSectionsOrder: (order) => {
      const { resumeData } = get();
      const updated = {
        ...resumeData,
        sectionsOrder: order,
      };
      pushToHistory(updated);
    },

    setActiveTemplate: (template) => {
      set({ activeTemplate: template });
      const state = get();
      saveState(state.resumeData, state.coverLetterData, template, state.theme, state.accentColor);
    },

    setAccentColor: (color) => {
      set({ accentColor: color });
      const state = get();
      saveState(state.resumeData, state.coverLetterData, state.activeTemplate, state.theme, color);
    },

    toggleTheme: () => {
      const currentTheme = get().theme;
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      set({ theme: nextTheme });
      const state = get();
      saveState(state.resumeData, state.coverLetterData, state.activeTemplate, nextTheme, state.accentColor);
    },

    loadResumeData: (data) => {
      // Direct load, overwrite history
      set({
        resumeData: data,
        past: [],
        future: [],
        canUndo: false,
        canRedo: false,
      });
      const state = get();
      saveState(data, state.coverLetterData, state.activeTemplate, state.theme, state.accentColor);
    },

    resetResumeData: () => {
      const emptyResume: ResumeData = {
        personalInfo: {
          fullName: '',
          professionalTitle: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          github: '',
          portfolio: '',
          summary: '',
        },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: [],
        achievements: [],
        sectionsOrder: INITIAL_SECTIONS_ORDER,
      };
      pushToHistory(emptyResume);
    },
  };
});
