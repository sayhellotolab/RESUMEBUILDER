import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { aiService } from '../services/aiService';
import { RefreshCw, Wand2, FileText, Calendar, Building, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CoverLetterForm: React.FC = () => {
  const { resumeData, coverLetterData, updateCoverLetter } = useResumeStore();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generatedContent = await aiService.generateCoverLetter(
        resumeData,
        coverLetterData.jobTitle,
        coverLetterData.companyName,
        coverLetterData.hiringManager
      );
      updateCoverLetter({ content: generatedContent });
      
      // Fun visual cue
      confetti({
        particleCount: 50,
        spread: 30,
        colors: ['#6366f1', '#10b981']
      });
    } catch (e) {
      console.error('Failed to generate cover letter', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950/80 rounded-2xl border border-gray-200/60 dark:border-zinc-800/80 overflow-hidden shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 font-heading">Cover Letter Details</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Enter the recipient's details and trigger the local AI helper to generate a professional cover letter custom-tailored to your resume achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1 flex items-center gap-1">
            <Building size={12} />
            <span>Target Company Name</span>
          </label>
          <input
            type="text"
            value={coverLetterData.companyName}
            onChange={(e) => updateCoverLetter({ companyName: e.target.value })}
            placeholder="e.g. Stripe Inc."
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1 flex items-center gap-1">
            <Building size={12} />
            <span>Target Job Title</span>
          </label>
          <input
            type="text"
            value={coverLetterData.jobTitle}
            onChange={(e) => updateCoverLetter({ jobTitle: e.target.value })}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1 flex items-center gap-1">
            <HelpCircle size={12} />
            <span>Hiring Manager / Committee</span>
          </label>
          <input
            type="text"
            value={coverLetterData.hiringManager}
            onChange={(e) => updateCoverLetter({ hiringManager: e.target.value })}
            placeholder="e.g. Hiring Committee"
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1 flex items-center gap-1">
            <Calendar size={12} />
            <span>Document Date</span>
          </label>
          <input
            type="date"
            value={coverLetterData.date}
            onChange={(e) => updateCoverLetter({ date: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !coverLetterData.companyName || !coverLetterData.jobTitle}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-55"
      >
        {loading ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
        <span>AI Generate Cover Letter Draft</span>
      </button>

      <div className="flex flex-col flex-1 min-h-[300px]">
        <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1 flex items-center gap-1">
          <FileText size={12} />
          <span>Cover Letter Content</span>
        </label>
        <textarea
          value={coverLetterData.content}
          onChange={(e) => updateCoverLetter({ content: e.target.value })}
          placeholder="Write your cover letter details here..."
          className="flex-1 w-full p-4 text-sm rounded-xl border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none font-sans leading-relaxed"
        />
      </div>
    </div>
  );
};
export default CoverLetterForm;
