import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import type { AccentColor } from '../types';

export const CoverLetterPreview: React.FC = () => {
  const { resumeData, coverLetterData, accentColor } = useResumeStore();

  const accentColorMap: Record<AccentColor, string> = {
    indigo: 'text-indigo-600 border-indigo-600',
    emerald: 'text-emerald-600 border-emerald-600',
    violet: 'text-violet-600 border-violet-600',
    rose: 'text-rose-600 border-rose-600',
    slate: 'text-slate-700 border-slate-700',
  };

  const currentAccent = accentColorMap[accentColor] || 'text-indigo-600 border-indigo-600';
  const accentText = currentAccent.split(' ')[0];

  return (
    <div className="w-full flex justify-center overflow-auto p-4 md:p-8 bg-gray-100 dark:bg-zinc-900/50 rounded-2xl border border-gray-200/60 dark:border-zinc-800/80 min-h-[500px]">
      <div className="pdf-container-scaler w-full max-w-[210mm]">
        <div id="coverletter-pdf-content" className="pdf-container">
          <div className={`accent-${accentColor} font-sans text-gray-900 bg-white min-h-[297mm] flex flex-col justify-between`}>
            
            <div>
              {/* Sender Header */}
              <div className="border-b pb-4 mb-6 border-gray-200">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-heading uppercase mb-1">
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className={`text-xs font-semibold tracking-wider uppercase ${accentText} mb-3`}>
                  {resumeData.personalInfo.professionalTitle || 'Professional Title'}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-mono">
                  {resumeData.personalInfo.email && <span>Email: {resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>Phone: {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>Location: {resumeData.personalInfo.location}</span>}
                </div>
              </div>

              {/* Recipient Details & Date */}
              <div className="mb-6 text-xs space-y-1 text-gray-700 font-mono">
                {coverLetterData.date && (
                  <div className="mb-3 text-gray-550">
                    {new Date(coverLetterData.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
                
                {coverLetterData.hiringManager && (
                  <div className="font-semibold text-gray-900">{coverLetterData.hiringManager}</div>
                )}
                
                {coverLetterData.companyName && (
                  <div className="font-semibold text-gray-800">{coverLetterData.companyName}</div>
                )}
                
                {coverLetterData.jobTitle && (
                  <div className="text-gray-500 italic">Re: Application for {coverLetterData.jobTitle}</div>
                )}
              </div>

              {/* Letter Content */}
              <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line text-justify pl-1">
                {coverLetterData.content || 'Draft content here...'}
              </div>
            </div>

            {/* Bottom Margin Footer spacing (formal signature gap) */}
            <div className="mt-12 text-xs text-gray-400 font-mono text-center border-t pt-4 border-gray-100">
              Generated via CraftResume Platform
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
export default CoverLetterPreview;
