import type { ResumeData } from '../types';

// Helper dictionary for keyword suggestion based on job title keywords
const KEYWORD_DATABASE: Record<string, string[]> = {
  software: [
    'React', 'TypeScript', 'Node.js', 'Next.js', 'System Design', 'CI/CD', 
    'REST APIs', 'Cloud Computing', 'Git', 'Agile/Scrum', 'Database Management',
    'Unit Testing', 'Kubernetes', 'Docker', 'Performance Optimization', 'Security'
  ],
  frontend: [
    'HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS',
    'State Management', 'Webpack', 'Vite', 'UI/UX Design', 'Responsive Web Design',
    'Accessibility (a11y)', 'SEO Optimization', 'Cross-browser Testing'
  ],
  backend: [
    'Node.js', 'Express', 'Python', 'Go', 'Java', 'PostgreSQL', 'MongoDB',
    'GraphQL', 'Microservices', 'RESTful API Design', 'Docker', 'Redis',
    'AWS', 'Serverless', 'Message Queues', 'Caching'
  ],
  product: [
    'Product Roadmap', 'Agile Methodology', 'User Research', 'Product Strategy',
    'Market Analysis', 'Cross-functional Collaboration', 'Jira', 'KPI Tracking',
    'A/B Testing', 'Stakeholder Management', 'User Stories', 'Wireframing'
  ],
  data: [
    'Python', 'SQL', 'R', 'Machine Learning', 'Data Visualization', 'Pandas',
    'TensorFlow', 'Data Pipelines', 'ETL', 'Tableau', 'Power BI', 'BigQuery',
    'Statistics', 'Data Warehousing', 'Feature Engineering'
  ],
  marketing: [
    'SEO', 'SEM', 'Google Analytics', 'Content Strategy', 'Social Media Marketing',
    'Email Campaigns', 'A/B Testing', 'Copywriting', 'Brand Management',
    'Conversion Rate Optimization (CRO)', 'Lead Generation', 'Market Research'
  ],
  sales: [
    'Lead Generation', 'B2B Sales', 'CRM (Salesforce)', 'Negotiation',
    'Client Relationship Management', 'Cold Outreach', 'Sales Pipeline',
    'Account Management', 'Revenue Growth', 'Deal Closing', 'Market Expansion'
  ],
  design: [
    'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Wireframing', 'Prototyping',
    'User Research', 'Design Systems', 'Typography', 'Information Architecture',
    'Visual Design', 'Interaction Design', 'Usability Testing'
  ],
  management: [
    'Team Leadership', 'Strategic Planning', 'Budgeting', 'Project Management',
    'Change Management', 'Resource Allocation', 'Conflict Resolution',
    'Operations', 'Stakeholder Relations', 'Process Improvement'
  ]
};

// Enhancement databases
const ENHANCEMENT_VERBS = [
  'Spearheaded', 'Engineered', 'Orchestrated', 'Optimized', 'Architected', 
  'Accelerated', 'Catalyzed', 'Formulated', 'Revamped', 'Streamlined', 
  'Pioneered', 'Cultivated', 'Synthesized', 'Delivered', 'Implemented'
];

const ENHANCEMENT_METRICS = [
  'improving performance by 35%',
  'reducing operational latency by 45%',
  'boosting active user engagement by 28%',
  'cutting deployment pipeline durations by 50%',
  'increasing overall project delivery efficiency by 20%',
  'generating an additional $45K in cost savings',
  'supporting high-scale traffic peaks up to 10K+ RPM',
  'increasing test coverage from 60% to 92%',
  'enhancing UI rendering speeds by 150ms'
];

const ENHANCEMENT_TECH_TAILS = [
  'utilizing modular system architectures',
  'leveraging modern asynchronous paradigms',
  'introducing automated validation steps',
  'refactoring legacy monolithic components',
  'implementing responsive design practices',
  'integrating cloud-native services',
  'optimizing database indices and queries'
];

export const aiService = {
  /**
   * Generates a professional summary options based on role, experience, and key skills
   */
  generateSummary: async (role: string, yearsOfExp: string, skillsInput: string): Promise<{
    executive: string;
    technical: string;
    creative: string;
  }> => {
    // Simulate API network lag
    await new Promise((resolve) => setTimeout(resolve, 800));

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const primarySkill = skills[0] || 'innovative technologies';
    const secondarySkills = skills.slice(1, 4).join(', ') || 'modern design methodologies';
    const years = parseFloat(yearsOfExp) || 3;
    const expText = years <= 2 ? 'emerging' : years <= 5 ? 'experienced' : 'distinguished';

    return {
      executive: `Dynamic and results-driven, ${expText} ${role} with ${years}+ years of experience in driving high-impact initiatives. Proven expertise in ${primarySkill} and ${secondarySkills}. Adept at partnering with cross-functional leadership to transform business vision into robust, scalable solutions that maximize client value and business productivity.`,
      
      technical: `Performance-focused ${role} with a deep specialization in ${primarySkill} and hands-on capability in ${skills.join(', ') || 'modern architecture styles'}. Focused on writing clean, maintainable systems, optimizing data efficiency, and building scalable pipelines. Experienced in Agile environments with a strong focus on CI/CD pipelines.`,
      
      creative: `Visionary ${role} with a unique blend of analytical prowess and creative execution. Over ${years} years creating human-centered workflows and architectures. Passionate about leveraging ${primarySkill} to solve complex challenges, improve customer delight, and design interfaces that seamlessly bridge business goals with user expectations.`
    };
  },

  /**
   * Improves basic bullet points by introducing strong verbs, context, and metrics.
   */
  enhanceBulletPoint: async (text: string): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    if (!text || text.trim().length < 5) {
      return [
        'Collaborated with cross-functional teams to design and implement highly scalable application interfaces.',
        'Spearheaded the development of new features, improving user experience by 25%.'
      ];
    }

    const cleanText = text.trim();
    const verb1 = ENHANCEMENT_VERBS[Math.floor(Math.random() * ENHANCEMENT_VERBS.length)];
    const metric1 = ENHANCEMENT_METRICS[Math.floor(Math.random() * ENHANCEMENT_METRICS.length)];
    const tail1 = ENHANCEMENT_TECH_TAILS[Math.floor(Math.random() * ENHANCEMENT_TECH_TAILS.length)];

    return [
      `${verb1} the delivery of core features related to "${cleanText}", successfully ${metric1}.`,
      `Engineered custom systems designed around "${cleanText}", ${tail1} to drive robust workflow scaling.`,
      `Orchestrated key updates for "${cleanText}" across multiple environments, reducing latency by 30% while maintaining 99.9% uptime.`
    ];
  },

  /**
   * Suggests keywords based on target job title
   */
  getKeywordsForJobTitle: (title: string): string[] => {
    if (!title) return KEYWORD_DATABASE.software;
    const lowerTitle = title.toLowerCase();
    
    for (const key in KEYWORD_DATABASE) {
      if (lowerTitle.includes(key)) {
        return KEYWORD_DATABASE[key];
      }
    }
    
    // Default backup keywords if no direct matches are found
    return [
      'Project Planning', 'Problem Solving', 'Teamwork', 'Communication', 
      'Process Improvement', 'Analytical Skills', 'Git', 'Leadership',
      'Data Analysis', 'Reporting'
    ];
  },

  /**
   * Scans resume text content and checks which target keywords are present
   */
  analyzeKeywordCoverage: (resumeData: ResumeData, targetKeywords: string[]): {
    found: string[];
    missing: string[];
    percentage: number;
  } => {
    // Collect all text from resume
    const searchString = [
      resumeData.personalInfo.fullName,
      resumeData.personalInfo.professionalTitle,
      resumeData.personalInfo.summary,
      ...resumeData.experience.map(e => `${e.company} ${e.position} ${e.description}`),
      ...resumeData.education.map(e => `${e.institution} ${e.degree} ${e.fieldOfStudy} ${e.description}`),
      ...resumeData.projects.map(p => `${p.name} ${p.role} ${p.description} ${p.technologies}`),
      ...resumeData.skills.map(s => s.name),
      ...resumeData.certifications.map(c => `${c.name} ${c.issuer}`),
      ...resumeData.achievements.map(a => `${a.title} ${a.description}`)
    ].join(' ').toLowerCase();

    const found: string[] = [];
    const missing: string[] = [];

    targetKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(searchString) || searchString.includes(keyword.toLowerCase())) {
        found.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const percentage = targetKeywords.length > 0 
      ? Math.round((found.length / targetKeywords.length) * 100) 
      : 100;

    return { found, missing, percentage };
  },

  /**
   * Calculates overall completeness score (0-100) and compiles a checklist of feedback tips
   */
  calculateResumeScore: (resumeData: ResumeData, targetJobTitle?: string): {
    score: number;
    suggestions: { id: string; text: string; impact: 'high' | 'medium' | 'low'; done: boolean }[];
  } => {
    let score = 0;
    const suggestions: { id: string; text: string; impact: 'high' | 'medium' | 'low'; done: boolean }[] = [];

    // 1. Personal Info Section (Max 35 points)
    const { fullName, professionalTitle, email, phone, location, linkedin, github, summary } = resumeData.personalInfo;
    
    // Full Name
    if (fullName && fullName.trim().length > 2) {
      score += 10;
      suggestions.push({ id: 'name', text: 'Add full name', impact: 'high', done: true });
    } else {
      suggestions.push({ id: 'name', text: 'Add your professional full name', impact: 'high', done: false });
    }

    // Title
    if (professionalTitle && professionalTitle.trim().length > 2) {
      score += 5;
      suggestions.push({ id: 'title', text: 'Add professional title', impact: 'high', done: true });
    } else {
      suggestions.push({ id: 'title', text: 'Specify a professional title (e.g. Software Engineer)', impact: 'high', done: false });
    }

    // Contact Email & Phone
    if (email && email.trim().includes('@')) {
      score += 5;
      suggestions.push({ id: 'email', text: 'Add valid email address', impact: 'high', done: true });
    } else {
      suggestions.push({ id: 'email', text: 'Include your contact email address', impact: 'high', done: false });
    }

    if (phone && phone.trim().length >= 7) {
      score += 5;
      suggestions.push({ id: 'phone', text: 'Add phone number', impact: 'high', done: true });
    } else {
      suggestions.push({ id: 'phone', text: 'Include your phone number for callback requests', impact: 'high', done: false });
    }

    // Location
    if (location && location.trim().length > 3) {
      score += 5;
      suggestions.push({ id: 'location', text: 'Add location', impact: 'medium', done: true });
    } else {
      suggestions.push({ id: 'location', text: 'Add your city/country location info', impact: 'medium', done: false });
    }

    // Social Links
    if ((linkedin && linkedin.trim().length > 0) || (github && github.trim().length > 0)) {
      score += 5;
      suggestions.push({ id: 'socials', text: 'Add LinkedIn or GitHub link', impact: 'medium', done: true });
    } else {
      suggestions.push({ id: 'socials', text: 'Provide a link to LinkedIn or GitHub profiles', impact: 'medium', done: false });
    }

    // 2. Summary Section (Max 10 points)
    if (summary && summary.trim().length > 100) {
      score += 10;
      suggestions.push({ id: 'summary', text: 'Write a comprehensive professional summary (>100 characters)', impact: 'high', done: true });
    } else if (summary && summary.trim().length > 10) {
      score += 5;
      suggestions.push({ id: 'summary', text: 'Expand your professional summary (aim for 100+ characters)', impact: 'medium', done: false });
    } else {
      suggestions.push({ id: 'summary', text: 'Draft an attention-grabbing professional summary', impact: 'high', done: false });
    }

    // 3. Work Experience Section (Max 25 points)
    if (resumeData.experience.length > 0) {
      score += 10;
      suggestions.push({ id: 'work_min', text: 'Add at least one work experience entry', impact: 'high', done: true });
      
      if (resumeData.experience.length >= 2) {
        score += 5;
        suggestions.push({ id: 'work_count', text: 'Add two or more work experience entries', impact: 'medium', done: true });
      } else {
        suggestions.push({ id: 'work_count', text: 'List more than one work experience to showcase your career growth', impact: 'medium', done: false });
      }

      // Check description lengths and action verbs in work experience
      const totalDescriptionChars = resumeData.experience.reduce((sum, e) => sum + (e.description?.length || 0), 0);
      const actionVerbsPattern = /\b(spearheaded|engineered|managed|developed|led|implemented|designed|created|optimized|revamped)\b/i;
      const hasActionVerbs = resumeData.experience.some(e => actionVerbsPattern.test(e.description));

      if (totalDescriptionChars > 150 && hasActionVerbs) {
        score += 10;
        suggestions.push({ id: 'work_details', text: 'Use action verbs and detailed descriptions', impact: 'high', done: true });
      } else {
        suggestions.push({ id: 'work_details', text: 'Enhance experience bullet points with action verbs and quantifiable metrics', impact: 'high', done: false });
      }
    } else {
      suggestions.push({ id: 'work_min', text: 'Add your professional experience', impact: 'high', done: false });
      suggestions.push({ id: 'work_details', text: 'Add detailed bullet points to your experience entries', impact: 'high', done: false });
    }

    // 4. Education Section (Max 10 points)
    if (resumeData.education.length > 0) {
      score += 10;
      suggestions.push({ id: 'education', text: 'Add education history', impact: 'high', done: true });
    } else {
      suggestions.push({ id: 'education', text: 'Add at least one education entry', impact: 'high', done: false });
    }

    // 5. Skills Section (Max 10 points)
    if (resumeData.skills.length >= 5) {
      score += 10;
      suggestions.push({ id: 'skills', text: 'List 5 or more key skills', impact: 'high', done: true });
    } else if (resumeData.skills.length > 0) {
      score += 5;
      suggestions.push({ id: 'skills', text: 'Add more skills (aim for at least 5 skills total)', impact: 'medium', done: false });
    } else {
      suggestions.push({ id: 'skills', text: 'List your core skills', impact: 'high', done: false });
    }

    // 6. Certifications, Languages, Projects, Achievements (Max 10 points)
    const bonusSectionCount = 
      (resumeData.projects.length > 0 ? 1 : 0) +
      (resumeData.certifications.length > 0 ? 1 : 0) +
      (resumeData.languages.length > 0 ? 1 : 0) +
      (resumeData.achievements.length > 0 ? 1 : 0);

    if (bonusSectionCount >= 2) {
      score += 10;
      suggestions.push({ id: 'bonus_sections', text: 'List project, languages, or certifications to stand out', impact: 'medium', done: true });
    } else if (bonusSectionCount >= 1) {
      score += 5;
      suggestions.push({ id: 'bonus_sections', text: 'Add another section (e.g. Projects or Languages) to enrich your profile', impact: 'low', done: false });
    } else {
      suggestions.push({ id: 'bonus_sections', text: 'Include Certifications, Languages, Projects, or Achievements', impact: 'medium', done: false });
    }

    // Adjust score dynamically if keyword optimization matches
    if (targetJobTitle) {
      const keywords = aiService.getKeywordsForJobTitle(targetJobTitle);
      const coverage = aiService.analyzeKeywordCoverage(resumeData, keywords);
      
      suggestions.push({
        id: 'keywords',
        text: `Target Keyword Coverage (${coverage.percentage}%): Include key terms like ${keywords.slice(0, 3).join(', ')}`,
        impact: 'medium',
        done: coverage.percentage >= 60
      });
    }

    return {
      score: Math.min(score, 100),
      suggestions
    };
  },

  /**
   * Generates a tailored Cover Letter draft pulling in information from resumeData
   */
  generateCoverLetter: async (
    resumeData: ResumeData,
    targetJobTitle: string,
    companyName: string,
    hiringManager: string
  ): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const name = resumeData.personalInfo.fullName || 'Candidate';
    const currentTitle = resumeData.personalInfo.professionalTitle || 'Experienced Specialist';
    const skills = resumeData.skills.map(s => s.name).slice(0, 3).join(', ') || 'exceptional talent and leadership';
    const topExperience = resumeData.experience[0];
    const experienceLine = topExperience
      ? `During my tenure as ${topExperience.position} at ${topExperience.company}, I spearheaded critical features and optimized workflows, expanding my proficiency in modern product design.`
      : `Throughout my career, I have focused on delivering robust systems and collaborating across teams to solve complex problems.`;

    return `Dear ${hiringManager || 'Hiring Committee'},\n\nI am writing to express my enthusiastic interest in the ${targetJobTitle || 'relevant position'} role at ${companyName || 'your company'}. As an experienced ${currentTitle} with a strong background in ${skills}, I am excited about the opportunity to bring my technical expertise and passion for design excellence to your esteemed team.\n\n${experienceLine} I pride myself on writing clean, maintainable code, building responsive interfaces, and working iteratively in agile environments. I am eager to apply these practices to help drive success for ${companyName || 'your organization'}.\n\nWhat excites me most about this opportunity is the chance to join a team focused on user satisfaction and developer excellence. I have long admired your brand's commitment to high standards, and I would love to discuss how my qualifications align with your objectives.\n\nThank you for your time and consideration. I look forward to the possibility of discussing this role in greater detail.\n\nSincerely,\n${name}`;
  }
};
