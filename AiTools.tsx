import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { aiService } from '../services/aiService';
import { Sparkles, X, Check, Copy, RefreshCw, Wand2 } from 'lucide-react';

interface AiToolsProps {
  isOpen: boolean;
  type: 'summary' | 'experience';
  targetId?: string;
  initialText?: string;
  onClose: () => void;
}

export const AiTools: React.FC<AiToolsProps> = ({ isOpen, type, targetId, initialText = '', onClose }) => {
  const { resumeData, updatePersonalInfo, updateExperience } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  
  // States for Summary Generator
  const [role, setRole] = useState(resumeData.personalInfo.professionalTitle || 'Software Engineer');
  const [years, setYears] = useState('5');
  const [skills, setSkills] = useState(resumeData.skills.map(s => s.name).slice(0, 3).join(', ') || 'React, TypeScript');
  
  const [summaryResults, setSummaryResults] = useState<{
    executive: string;
    technical: string;
    creative: string;
  } | null>(null);

  // States for Bullet Point Enhancer
  const [bulletText, setBulletText] = useState(initialText);
  const [bulletResults, setBulletResults] = useState<string[]>([]);

  // Reset inputs when tool type opens
  useEffect(() => {
    if (isOpen) {
      if (type === 'summary') {
        setRole(resumeData.personalInfo.professionalTitle || 'Software Engineer');
        setSkills(resumeData.skills.map(s => s.name).slice(0, 3).join(', ') || 'React, TypeScript');
        setSummaryResults(null);
      } else {
        setBulletText(initialText);
        setBulletResults([]);
      }
    }
  }, [isOpen, type, initialText, resumeData]);

  if (!isOpen) return null;

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const res = await aiService.generateSummary(role, years, skills);
      setSummaryResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceBullet = async () => {
    setLoading(true);
    try {
      const res = await aiService.enhanceBulletPoint(bulletText);
      setBulletResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySummary = (text: string) => {
    updatePersonalInfo({ summary: text });
    onClose();
  };

  const handleApplyBullet = (text: string) => {
    if (targetId) {
      updateExperience(targetId, { description: text });
    }
    onClose();
  };

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800/80 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800/50 p-4 bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600 dark:text-indigo-400" size={18} />
            <h3 className="font-heading font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
              {type === 'summary' ? 'AI Summary Generator' : 'AI Bullet Point Enhancer'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {type === 'summary' ? (
            // SUMMARY FIELDS
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Role</label>
                  <input 
                    type="text" value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Years Experience</label>
                  <input 
                    type="number" value={years} onChange={(e) => setYears(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Key Skills</label>
                  <input 
                    type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, AWS, SQL"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={loading || !role}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-55"
              >
                {loading ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                <span>Generate Professional Summaries</span>
              </button>

              {/* Summary Generator Results */}
              {summaryResults && !loading && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-850">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-350 uppercase">Select Summary Option:</h4>
                  
                  <div className="space-y-3">
                    {/* Executive */}
                    <div className="p-3 border border-gray-150 dark:border-zinc-800 rounded-xl bg-gray-50/20 dark:bg-zinc-900/30 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">// Executive Profile</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopyToClipboard(summaryResults.executive, 1)}
                            className="text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                          >
                            {copiedIdx === 1 ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                            <span>{copiedIdx === 1 ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button 
                            onClick={() => handleApplySummary(summaryResults.executive)}
                            className="text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed text-justify">{summaryResults.executive}</p>
                    </div>

                    {/* Technical */}
                    <div className="p-3 border border-gray-150 dark:border-zinc-800 rounded-xl bg-gray-50/20 dark:bg-zinc-900/30 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">// Technical Profile</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopyToClipboard(summaryResults.technical, 2)}
                            className="text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                          >
                            {copiedIdx === 2 ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                            <span>{copiedIdx === 2 ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button 
                            onClick={() => handleApplySummary(summaryResults.technical)}
                            className="text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed text-justify">{summaryResults.technical}</p>
                    </div>

                    {/* Creative */}
                    <div className="p-3 border border-gray-150 dark:border-zinc-800 rounded-xl bg-gray-50/20 dark:bg-zinc-900/30 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">// Creative & Product Profile</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCopyToClipboard(summaryResults.creative, 3)}
                            className="text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                          >
                            {copiedIdx === 3 ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                            <span>{copiedIdx === 3 ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button 
                            onClick={() => handleApplySummary(summaryResults.creative)}
                            className="text-emerald-600 hover:text-emerald-700 font-bold"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed text-justify">{summaryResults.creative}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // BULLET POINT ENHANCER FIELDS
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Your basic description or bullet point</label>
                <textarea 
                  value={bulletText} 
                  onChange={(e) => setBulletText(e.target.value)}
                  placeholder="e.g. helped speed up the database search queries"
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none resize-y"
                />
              </div>

              <button
                onClick={handleEnhanceBullet}
                disabled={loading || !bulletText}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all disabled:opacity-55"
              >
                {loading ? <RefreshCw className="animate-spin" size={14} /> : <Wand2 size={14} />}
                <span>Enhance Bullet Point</span>
              </button>

              {/* Bullet Enhancer Results */}
              {bulletResults.length > 0 && !loading && (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-850">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-350 uppercase">Select Enhanced Option:</h4>
                  
                  <div className="space-y-3">
                    {bulletResults.map((result, idx) => (
                      <div key={idx} className="p-3 border border-gray-150 dark:border-zinc-800 rounded-xl bg-gray-50/20 dark:bg-zinc-900/30 space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">// Enhanced Option 0{idx + 1}</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleCopyToClipboard(result, idx)}
                              className="text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                            >
                              {copiedIdx === idx ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                              <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                            <button 
                              onClick={() => handleApplyBullet(result)}
                              className="text-emerald-600 hover:text-emerald-700 font-bold"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed text-justify">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Skeleton Loaders */}
          {loading && (
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800/40">
              <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-16 bg-gray-150 dark:bg-zinc-900/50 rounded-xl animate-pulse" />
                <div className="h-16 bg-gray-150 dark:bg-zinc-900/50 rounded-xl animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AiTools;
