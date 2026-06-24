import React from 'react';
import type { ResumeData, AccentColor } from '../types';

interface TemplateProps {
  data: ResumeData;
  accentColor: AccentColor;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, accentColor }) => {
  const { personalInfo, experience, education, projects, skills, certifications, languages, achievements, sectionsOrder } = data;

  const accentColorMap: Record<AccentColor, string> = {
    indigo: 'text-indigo-600 border-indigo-600',
    emerald: 'text-emerald-600 border-emerald-600',
    violet: 'text-violet-600 border-violet-600',
    rose: 'text-rose-600 border-rose-600',
    slate: 'text-slate-700 border-slate-700',
  };

  const currentAccent = accentColorMap[accentColor] || 'text-indigo-600 border-indigo-600';
  const accentText = currentAccent.split(' ')[0];
  const accentBorder = currentAccent.split(' ')[1];

  // Section Renderers
  const renderPersonalInfo = () => (
    <div className="mb-6 text-center border-b pb-4 border-gray-200">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-heading mb-1 uppercase">
        {personalInfo.fullName || 'Your Name'}
      </h1>
      <p className={`text-md font-medium tracking-wide uppercase ${accentText} mb-3`}>
        {personalInfo.professionalTitle || 'Professional Title'}
      </p>
      
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>• {personalInfo.phone}</span>}
        {personalInfo.location && <span>• {personalInfo.location}</span>}
        {personalInfo.linkedin && (
          <span>
            • <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin}</a>
          </span>
        )}
        {personalInfo.github && (
          <span>
            • <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.github}</a>
          </span>
        )}
        {personalInfo.portfolio && (
          <span>
            • <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.portfolio}</a>
          </span>
        )}
      </div>

      {personalInfo.summary && (
        <p className="mt-4 text-sm text-gray-700 text-justify leading-relaxed">
          {personalInfo.summary}
        </p>
      )}
    </div>
  );

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" className="mb-6 page-break-avoid">
        <h2 className={`text-sm font-bold tracking-wider uppercase border-b-2 ${accentBorder} pb-1 mb-3 text-gray-800`}>
          Work Experience
        </h2>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="text-sm">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>{exp.position}</span>
                <span className="text-gray-500 font-normal">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mb-1 italic">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l border-gray-200">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = () => {
    if (education.length === 0) return null;
    return (
      <div key="education" className="mb-6 page-break-avoid">
        <h2 className={`text-sm font-bold tracking-wider uppercase border-b-2 ${accentBorder} pb-1 mb-3 text-gray-800`}>
          Education
        </h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="text-sm">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-gray-500 font-normal">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mb-1 italic">
                <span>{edu.institution}</span>
                <span>{edu.location}</span>
              </div>
              {edu.description && (
                <p className="text-xs text-gray-700 leading-relaxed pl-2 border-l border-gray-200">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (projects.length === 0) return null;
    return (
      <div key="projects" className="mb-6 page-break-avoid">
        <h2 className={`text-sm font-bold tracking-wider uppercase border-b-2 ${accentBorder} pb-1 mb-3 text-gray-800`}>
          Key Projects
        </h2>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="text-sm">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>
                  {proj.name} {proj.role && <span className="font-normal text-gray-500">| {proj.role}</span>}
                </span>
                {proj.url && (
                  <a href={`https://${proj.url}`} target="_blank" rel="noreferrer" className={`text-xs hover:underline font-normal ${accentText}`}>
                    {proj.url}
                  </a>
                )}
              </div>
              {proj.technologies && (
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Technologies: {proj.technologies}
                </p>
              )}
              <p className="text-xs text-gray-700 leading-relaxed pl-2 border-l border-gray-200">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (skills.length === 0) return null;
    
    // Group skills by category if available, otherwise generic
    const categories: Record<string, typeof skills> = {};
    skills.forEach(s => {
      const cat = s.category || 'Skills';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(s);
    });

    return (
      <div key="skills" className="mb-6 page-break-avoid">
        <h2 className={`text-sm font-bold tracking-wider uppercase border-b-2 ${accentBorder} pb-1 mb-3 text-gray-800`}>
          Skills
        </h2>
        <div className="space-y-2">
          {Object.entries(categories).map(([cat, skillList]) => (
            <div key={cat} className="text-xs">
              <span className="font-semibold text-gray-800">{cat}: </span>
              <span className="text-gray-700">
                {skillList.map(s => s.name).join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications" className="mb-6 page-break-avoid">
        <h2 className={`text-sm font-bold tracking-wider uppercase border-b-2 ${accentBorder} pb-1 mb-3 text-gray-800`}>
          Certifications
        </h2>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="border-l border-gray-200 pl-2">
              <div className="font-semibold text-gray-900">{cert.name}</div>
              <div className="text-gray-600">
                {cert.issuer} {cert.date && <span>• {cert.date}</span>}
              </div>
              {cert.url && (
                <a href={`https://${cert.url}`} target="_blank" rel="noreferrer" className={`hover:underline block ${accentText}`}>
                  Credential Link
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (languages.length === 0) return null;
    return (
      <div key="languages" className="mb-6 page-break-avoid">
        <h2 className={`text-sm font-bold tracking-wider uppercase border-b-2 ${accentBorder} pb-1 mb-3 text-gray-800`}>
          Languages
        </h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
          {languages.map((lang) => (
            <div key={lang.id} className="text-gray-700">
              <span className="font-semibold text-gray-800">{lang.name}</span> ({lang.proficiency})
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (achievements.length === 0) return null;
    return (
      <div key="achievements" className="mb-6 page-break-avoid">
        <h2 className={`text-sm font-bold tracking-wider uppercase border-b-2 ${accentBorder} pb-1 mb-3 text-gray-800`}>
          Key Achievements
        </h2>
        <div className="space-y-3 text-xs">
          {achievements.map((ach) => (
            <div key={ach.id} className="border-l border-gray-200 pl-2">
              <div className="flex justify-between font-semibold text-gray-900">
                <span>{ach.title}</span>
                <span className="text-gray-500 font-normal">{ach.date}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sectionMap: Record<string, () => React.ReactNode> = {
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    skills: renderSkills,
    certifications: renderCertifications,
    languages: renderLanguages,
    achievements: renderAchievements,
  };

  return (
    <div className="print-page font-sans bg-white leading-normal tracking-normal text-gray-900">
      {renderPersonalInfo()}
      
      <div className="flex flex-col gap-1">
        {sectionsOrder.map((section) => {
          if (section === 'personal') return null; // rendered first always
          const renderer = sectionMap[section];
          return renderer ? renderer() : null;
        })}
      </div>
    </div>
  );
};
