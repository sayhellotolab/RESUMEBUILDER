import React from 'react';
import type { ResumeData, AccentColor } from '../types';

interface TemplateProps {
  data: ResumeData;
  accentColor: AccentColor;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, accentColor }) => {
  const { personalInfo, experience, education, projects, skills, certifications, languages, achievements, sectionsOrder } = data;

  const accentColorMap: Record<AccentColor, { text: string; bg: string; border: string; progress: string }> = {
    indigo: {
      text: 'text-indigo-600',
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-600',
      progress: 'bg-indigo-600',
    },
    emerald: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-600',
      progress: 'bg-emerald-600',
    },
    violet: {
      text: 'text-violet-600',
      bg: 'bg-violet-50/50',
      border: 'border-violet-600',
      progress: 'bg-violet-600',
    },
    rose: {
      text: 'text-rose-600',
      bg: 'bg-rose-50/50',
      border: 'border-rose-600',
      progress: 'bg-rose-600',
    },
    slate: {
      text: 'text-slate-700',
      bg: 'bg-slate-100/50',
      border: 'border-slate-700',
      progress: 'bg-slate-700',
    },
  };

  const colors = accentColorMap[accentColor] || accentColorMap.indigo;

  // Render sidebar contents
  const renderSidebarSkills = () => {
    if (skills.length === 0) return null;
    return (
      <div className="mb-6 page-break-avoid">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
          Skills
        </h3>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="text-xs">
              <div className="flex justify-between font-medium text-gray-700 mb-1">
                <span>{skill.name}</span>
                <span className="text-gray-500">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${colors.progress}`} 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSidebarLanguages = () => {
    if (languages.length === 0) return null;
    return (
      <div className="mb-6 page-break-avoid">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
          Languages
        </h3>
        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.id} className="text-xs flex justify-between">
              <span className="font-semibold text-gray-800">{lang.name}</span>
              <span className="text-gray-600">{lang.proficiency}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSidebarCertifications = () => {
    if (certifications.length === 0) return null;
    return (
      <div className="mb-6 page-break-avoid">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
          Certificates
        </h3>
        <div className="space-y-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="text-xs">
              <div className="font-semibold text-gray-800">{cert.name}</div>
              <div className="text-gray-600 text-[10px]">{cert.issuer}</div>
              {cert.date && <div className="text-gray-400 text-[9px]">{cert.date}</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render main body contents
  const renderMainSummary = () => {
    if (!personalInfo.summary) return null;
    return (
      <div className="mb-6">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-2 border-b pb-1 border-gray-200`}>
          Profile
        </h3>
        <p className="text-xs text-gray-700 leading-relaxed text-justify">
          {personalInfo.summary}
        </p>
      </div>
    );
  };

  const renderMainExperience = () => {
    if (experience.length === 0) return null;
    return (
      <div className="mb-6 page-break-avoid">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
          Experience
        </h3>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs">
              <div className="flex justify-between font-bold text-gray-800">
                <span>{exp.position}</span>
                <span className="text-gray-500 font-normal">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-gray-600 mb-1 flex justify-between font-medium">
                <span>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-justify pl-2 border-l-2 border-gray-200">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMainEducation = () => {
    if (education.length === 0) return null;
    return (
      <div className="mb-6 page-break-avoid">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
          Education
        </h3>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex justify-between font-bold text-gray-800">
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="text-gray-500 font-normal">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
              <div className="text-gray-600 mb-1 flex justify-between font-medium">
                <span>{edu.institution}</span>
                <span>{edu.location}</span>
              </div>
              {edu.description && <p className="text-gray-600 leading-relaxed pl-2 border-l-2 border-gray-200">{edu.description}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMainProjects = () => {
    if (projects.length === 0) return null;
    return (
      <div className="mb-6 page-break-avoid">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
          Projects
        </h3>
        <div className="space-y-4">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex justify-between font-bold text-gray-800">
                <span>{proj.name}</span>
                {proj.url && (
                  <a href={`https://${proj.url}`} target="_blank" rel="noreferrer" className={`hover:underline block font-normal ${colors.text}`}>
                    {proj.url}
                  </a>
                )}
              </div>
              {proj.role && <div className="text-gray-500 text-[10px] mb-1">{proj.role}</div>}
              {proj.technologies && (
                <div className="text-gray-600 text-[10px] mb-1">
                  <span className="font-semibold">Tech stack:</span> {proj.technologies}
                </div>
              )}
              <p className="text-gray-600 leading-relaxed pl-2 border-l-2 border-gray-200">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMainAchievements = () => {
    if (achievements.length === 0) return null;
    return (
      <div className="mb-6 page-break-avoid">
        <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
          Achievements
        </h3>
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div key={ach.id} className="text-xs pl-2 border-l-2 border-gray-200">
              <div className="flex justify-between font-bold text-gray-800">
                <span>{ach.title}</span>
                <span className="text-gray-500 font-normal">{ach.date}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mt-0.5">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Section divider logic to split between sidebar and main body
  // Left Column (Sidebar): Skills, Languages, Certifications
  // Right Column (Main): Summary, Experience, Education, Projects, Achievements
  const renderSidebar = () => {
    return (
      <aside className={`w-[230px] p-6 ${colors.bg} flex flex-col h-full border-r border-gray-200/50`}>
        {/* Contact details */}
        <div className="mb-6 text-xs text-gray-700">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text} mb-3 border-b pb-1 border-gray-200`}>
            Contact Info
          </h3>
          <div className="space-y-2.5 break-all">
            {personalInfo.email && (
              <div>
                <span className="block font-semibold text-gray-800">Email</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <span className="block font-semibold text-gray-800">Phone</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div>
                <span className="block font-semibold text-gray-800">Location</span>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div>
                <span className="block font-semibold text-gray-800">LinkedIn</span>
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin}</a>
              </div>
            )}
            {personalInfo.github && (
              <div>
                <span className="block font-semibold text-gray-800">GitHub</span>
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.github}</a>
              </div>
            )}
            {personalInfo.portfolio && (
              <div>
                <span className="block font-semibold text-gray-800">Portfolio</span>
                <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.portfolio}</a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar reordered sections */}
        {sectionsOrder.map((section) => {
          if (section === 'skills') return renderSidebarSkills();
          if (section === 'languages') return renderSidebarLanguages();
          if (section === 'certifications') return renderSidebarCertifications();
          return null;
        })}
      </aside>
    );
  };

  const renderMainBody = () => {
    const mainSectionMap: Record<string, () => React.ReactNode> = {
      experience: renderMainExperience,
      education: renderMainEducation,
      projects: renderMainProjects,
      achievements: renderMainAchievements,
    };

    return (
      <main className="flex-1 p-6">
        {renderMainSummary()}
        
        {sectionsOrder.map((section) => {
          const renderer = mainSectionMap[section];
          return renderer ? renderer() : null;
        })}
      </main>
    );
  };

  return (
    <div className="print-page font-sans bg-white leading-normal tracking-normal text-gray-900 border border-gray-100 flex flex-row min-h-[297mm]">
      {/* Sidebar left */}
      {renderSidebar()}

      {/* Main content right */}
      <div className="flex-1 flex flex-col justify-start">
        {/* Header bar */}
        <header className={`p-6 border-b border-gray-100 flex flex-col justify-center`}>
          <h1 className="text-3xl font-extrabold text-gray-900 font-heading mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className={`text-sm font-semibold tracking-wider uppercase ${colors.text}`}>
            {personalInfo.professionalTitle || 'Professional Title'}
          </p>
        </header>

        {renderMainBody()}
      </div>
    </div>
  );
};
