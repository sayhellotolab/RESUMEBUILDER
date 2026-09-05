import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { aiService } from '../services/aiService';
import { AlertCircle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const ScoreMeter: React.FC = () => {
  const { resumeData } = useResumeStore();
  const [targetJobTitle, setTargetJobTitle] = useState('Software Engineer');
  
  const { score, suggestions } = aiService.calculateResumeScore(resumeData, targetJobTitle);
  const keywords = aiService.getKeywordsForJobTitle(targetJobTitle);
  const keywordAnalysis = aiService.analyzeKeywordCoverage(resumeData, keywords);

  const getScoreColor = (val: number) => {
    if (val < 50) return 'text-red-500 stroke-red-500 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20';
    if (val < 80) return 'text-amber-500 stroke-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
    return 'text-emerald-500 stroke-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
  };

  return (
    <div className="bg-white dark:bg-zinc-950/80 p-5 rounded-2xl border border-gray-200/60 dark:border-zinc-800/80 shadow-sm space-y-5">
      {/* Target Job Title & Search Box */}
      <div>
        <label className="block text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Target Job Title (for Keyword Audit)</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={targetJobTitle}
            onChange={(e) => setTargetJobTitle(e.target.value)}
            placeholder="e.g. Frontend Developer"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Score Circle & Linear Indicator */}
      <div className={`p-4 rounded-xl border flex items-center gap-4 ${getScoreColor(score)}`}>
        <div className="relative flex items-center justify-center h-16 w-16 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-250 dark:text-zinc-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="transition-all duration-500"
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-md font-extrabold text-gray-900 dark:text-white font-heading">
            {score}%
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
            <TrendingUp size={14} className="text-indigo-500" />
            <span>ATS Resume Completeness Score</span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            {score < 50 
              ? 'Critical sections are missing. Enhance your profile detail to avoid screening rejections.' 
              : score < 80 
                ? 'Looking good! Review the suggested tips to maximize compatibility.'
                : 'Excellent resume score! Highly optimized for ATS platforms.'}
          </p>
        </div>
      </div>

      {/* Target Keywords Audit */}
      <div className="p-4 bg-indigo-50/20 dark:bg-zinc-900/40 border border-indigo-100/40 dark:border-zinc-800/40 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1">
            <Sparkles size={12} className="text-indigo-500" />
            <span>ATS Keywords Found</span>
          </span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{keywordAnalysis.percentage}%</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${keywordAnalysis.percentage}%` }}
          />
        </div>

        {/* Found vs Missing badge list */}
        <div className="flex flex-wrap gap-1 mt-1 max-h-24 overflow-y-auto pt-1 no-scrollbar">
          {keywordAnalysis.found.map(kw => (
            <span key={kw} className="text-[9px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <span>{kw}</span>
            </span>
          ))}
          {keywordAnalysis.missing.map(kw => (
            <span key={kw} className="text-[9px] font-bold bg-gray-50 dark:bg-zinc-900/60 text-gray-500 dark:text-zinc-500 border border-gray-200/50 dark:border-zinc-800 px-1.5 py-0.5 rounded-full">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions checklist */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-gray-900 dark:text-zinc-300 uppercase">Improvement Suggestions</h4>
        
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {suggestions.map((sug) => (
            <div 
              key={sug.id} 
              className={`p-2.5 border rounded-xl flex items-start gap-2.5 transition-all text-xs ${
                sug.done
                  ? 'bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-100/40 dark:border-emerald-900/10 opacity-70'
                  : 'bg-zinc-50 dark:bg-zinc-900/50 border-gray-100 dark:border-zinc-800/40'
              }`}
            >
              {sug.done ? (
                <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle size={15} className={`mt-0.5 flex-shrink-0 ${
                  sug.impact === 'high' ? 'text-red-500' : sug.impact === 'medium' ? 'text-amber-500' : 'text-gray-400'
                }`} />
              )}
              
              <div className="flex-1">
                <span className={`font-semibold block ${sug.done ? 'line-through text-gray-500 dark:text-zinc-500' : 'text-gray-700 dark:text-zinc-200'}`}>
                  {sug.text}
                </span>
                {!sug.done && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${
                    sug.impact === 'high' ? 'text-red-500' : sug.impact === 'medium' ? 'text-amber-500' : 'text-gray-400'
                  }`}>
                    {sug.impact} Impact
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ScoreMeter;
