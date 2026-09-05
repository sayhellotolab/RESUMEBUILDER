import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { ModernTemplate } from '../templates/ModernTemplate';
import { MinimalTemplate } from '../templates/MinimalTemplate';

export const ResumePreview: React.FC = () => {
  const { resumeData, activeTemplate, accentColor } = useResumeStore();

  const renderTemplate = () => {
    switch (activeTemplate) {
      case 'modern':
        return <ModernTemplate data={resumeData} accentColor={accentColor} />;
      case 'minimal':
        return <MinimalTemplate data={resumeData} accentColor={accentColor} />;
      case 'professional':
      default:
        return <ProfessionalTemplate data={resumeData} accentColor={accentColor} />;
    }
  };

  return (
    <div className="w-full flex justify-center overflow-auto p-4 md:p-8 bg-gray-100 dark:bg-zinc-900/50 rounded-2xl border border-gray-200/60 dark:border-zinc-800/80 min-h-[500px]">
      <div className="pdf-container-scaler w-full max-w-[210mm]">
        <div id="resume-pdf-content" className="pdf-container accent-indigo">
          <div className={`accent-${accentColor}`}>
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResumePreview;
