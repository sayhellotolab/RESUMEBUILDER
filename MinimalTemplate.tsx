import React from 'react';
import type { ResumeData, AccentColor } from '../types';

interface TemplateProps {
  data: ResumeData;
  accentColor: AccentColor;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, accentColor }) => {
  const { personalInfo, experience, education, projects, skills, certifications, languages, achievements, sectionsOrder } = data;

  const accentColorMap: Record<AccentColor, string> = {
    indigo: 'text-indigo-600 border-indigo-200',
    emerald: 'text-emerald-600 border-emerald-200',
    violet: 'text-violet-600 border-violet-200',
    rose: 'text-rose-600 border-rose-200',
    slate: 'text-slate-800 border-slate-200',
  };

  const currentAccent = accentColorMap[accentColor] || 'text-indigo-600 border-indigo-200';
  const accentText = currentAccent.split(' ')[0];

  const renderPersonalInfo = () => (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline border-b border-gray-900 pb-4 mb-4">
        <div>
          <h1 className="text-3xl font-serif font-semibold text-gray-900 mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-medium text-gray-600 tracking-wide uppercase">
            {personalInfo.professionalTitle || 'Professional Title'}
          </p>
        </div>
        <div className="text-right text-xs text-gray-600 space-y-0.5 mt-3 md:mt-0 font-mono">
          {personalInfo.email && <div className="hover:underline">{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-mono mb-4">
        {personalInfo.linkedin && (
          <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
            [ln] {personalInfo.linkedin}
          </a>
        )}
        {personalInfo.github && (
          <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">
            [gh] {personalInfo.github}
          </a>
        )}
        {personalInfo.portfolio && (
          <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noreferrer" className="hover:underline">
            [web] {personalInfo.portfolio}
          </a>
        )}
      </div>

      {personalInfo.summary && (
        <p className="text-xs text-gray-700 leading-relaxed text-justify mb-6">
          {personalInfo.summary}
        </p>
      )}
    </div>
  );

  const renderExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div key="experience" className="mb-6 page-break-avoid">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 font-mono">
          // Experience
        </h2>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="grid grid-cols-4 gap-4 text-xs">
              <div className="col-span-1 text-gray-500 font-mono">
                {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
              </div>
              <div className="col-span-3">
                <div className="font-bold text-gray-900">
                  {exp.position} <span className="font-normal text-gray-400">|</span> <span className="font-semibold text-gray-600">{exp.company}</span>
                </div>
                <div className="text-[10px] text-gray-400 mb-1">{exp.location}</div>
                <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
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
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 font-mono">
          // Education
        </h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="grid grid-cols-4 gap-4 text-xs">
              <div className="col-span-1 text-gray-500 font-mono">
                {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
              </div>
              <div className="col-span-3">
                <div className="font-bold text-gray-900">
                  {edu.degree} in {edu.fieldOfStudy}
                </div>
                <div className="text-gray-600 font-medium">
                  {edu.institution} <span className="text-gray-400 text-[10px] font-normal">({edu.location})</span>
                </div>
                {edu.description && <p className="text-gray-600 leading-relaxed mt-1">{edu.description}</p>}
              </div>
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
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 font-mono">
          // Projects
        </h2>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="grid grid-cols-4 gap-4 text-xs">
              <div className="col-span-1 text-gray-500 font-mono flex flex-col justify-start">
                <span>{proj.role}</span>
                {proj.url && (
                  <a href={`https://${proj.url}`} target="_blank" rel="noreferrer" className={`hover:underline mt-1 font-mono text-[10px] truncate ${accentText}`}>
                    Link
                  </a>
                )}
              </div>
              <div className="col-span-3">
                <div className="font-bold text-gray-900">{proj.name}</div>
                {proj.technologies && (
                  <div className="text-[10px] text-gray-500 font-mono mb-1">
                    [{proj.technologies}]
                  </div>
                )}
                <p className="text-gray-600 leading-relaxed">{proj.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (skills.length === 0) return null;
    
    // Group skills by category
    const categories: Record<string, typeof skills> = {};
    skills.forEach(s => {
      const cat = s.category || 'Core';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(s);
    });

    return (
      <div key="skills" className="mb-6 page-break-avoid">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 font-mono">
          // Technical Skills
        </h2>
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div className="col-span-1 text-gray-500 font-mono">
            Stack
          </div>
          <div className="col-span-3 space-y-2">
            {Object.entries(categories).map(([cat, list]) => (
              <div key={cat} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-semibold text-gray-700 font-mono text-[10px] uppercase">{cat}:</span>
                <span className="text-gray-600">
                  {list.map(s => s.name).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div key="certifications" className="mb-6 page-break-avoid">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 font-mono">
          // Certifications
        </h2>
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="grid grid-cols-4 gap-4 text-xs">
              <div className="col-span-1 text-gray-500 font-mono">{cert.date}</div>
              <div className="col-span-3">
                <span className="font-semibold text-gray-900">{cert.name}</span>
                <span className="text-gray-400"> / </span>
                <span className="text-gray-600 font-medium">{cert.issuer}</span>
                {cert.url && (
                  <a href={`https://${cert.url}`} target="_blank" rel="noreferrer" className={`hover:underline block font-mono text-[9px] mt-0.5 ${accentText}`}>
                    Verify URL
                  </a>
                )}
              </div>
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
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 font-mono">
          // Languages
        </h2>
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div className="col-span-1 text-gray-500 font-mono">Proficiency</div>
          <div className="col-span-3 flex flex-wrap gap-x-4">
            {languages.map((lang) => (
              <span key={lang.id} className="text-gray-700">
                <span className="font-semibold text-gray-800">{lang.name}</span> ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (achievements.length === 0) return null;
    return (
      <div key="achievements" className="mb-6 page-break-avoid">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3 font-mono">
          // Key Achievements
        </h2>
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div key={ach.id} className="grid grid-cols-4 gap-4 text-xs">
              <div className="col-span-1 text-gray-500 font-mono">{ach.date}</div>
              <div className="col-span-3">
                <div className="font-bold text-gray-900 mb-0.5">{ach.title}</div>
                <p className="text-gray-600 leading-relaxed">{ach.description}</p>
              </div>
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

      <div className="space-y-4">
        {sectionsOrder.map((section) => {
          if (section === 'personal') return null;
          const renderer = sectionMap[section];
          return renderer ? renderer() : null;
        })}
      </div>
    </div>
  );
};
