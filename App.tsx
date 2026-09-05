import React, { useState, useRef } from 'react';
import { useResumeStore } from './store/useResumeStore';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { CoverLetterForm } from './components/CoverLetterForm';
import { CoverLetterPreview } from './components/CoverLetterPreview';
import { ScoreMeter } from './components/ScoreMeter';
import { AiTools } from './components/AiTools';
import { exportToPdf } from './utils/pdfExport';
import { exportToDocx } from './utils/docxExport';
import { 
  Sparkles, Undo2, Redo2, FileDown, 
  Upload, FileJson, Trash2, Sun, Moon, Palette, FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const {
    resumeData,
    activeTemplate,
    accentColor,
    theme,
    canUndo,
    canRedo,
    activeTab,
    undo,
    redo,
    setActiveTemplate,
    setAccentColor,
    toggleTheme,
    loadResumeData,
    resetResumeData,
    setActiveTab
  } = useResumeStore();

  // AI Drawer State
  const [aiDrawer, setAiDrawer] = useState<{
    isOpen: boolean;
    type: 'summary' | 'experience';
    targetId?: string;
    text?: string;
  }>({
    isOpen: false,
    type: 'summary',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // PDF trigger
  const handlePdfExport = () => {
    if (activeTab === 'resume') {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_CV.pdf`;
      exportToPdf('resume-pdf-content', filename);
    } else {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_CoverLetter.pdf`;
      exportToPdf('coverletter-pdf-content', filename);
    }
    
    // Confetti burst for user delight
    confetti({
      particleCount: 120,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  // DOCX trigger
  const handleDocxExport = () => {
    if (activeTab === 'resume') {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_CV.docx`;
      exportToDocx('resume-pdf-content', filename);
    } else {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_CoverLetter.docx`;
      exportToDocx('coverletter-pdf-content', filename);
    }
    
    confetti({
      particleCount: 120,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  // JSON Import/Export
  const handleJsonExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo && parsed.sectionsOrder) {
          loadResumeData(parsed);
          confetti({ particleCount: 50, spread: 40 });
        } else {
          alert('Invalid resume JSON structure.');
        }
      } catch (err) {
        alert('Failed to parse file. Please upload a valid JSON resume.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your current progress and start fresh? This action can be undone.')) {
      resetResumeData();
    }
  };

  const openAiEnhancer = (type: 'summary' | 'experience', targetId?: string, text?: string) => {
    setAiDrawer({
      isOpen: true,
      type,
      targetId,
      text,
    });
  };

  return (
    <div className={`min-h-screen pb-12 transition-colors duration-250 bg-neutral-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${accentColor === 'indigo' ? 'accent-indigo' : accentColor === 'emerald' ? 'accent-emerald' : accentColor === 'violet' ? 'accent-violet' : accentColor === 'rose' ? 'accent-rose' : 'accent-slate'}`}>
      
      {/* Dynamic styles mapping for custom theme color badge backgrounds */}
      <span className="hidden accent-indigo accent-emerald accent-violet accent-rose accent-slate" />

      {/* Nav Header */}
      <header className="sticky top-0 z-30 w-full border-b border-gray-250/50 dark:border-zinc-900 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo / Branding */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200 dark:shadow-none">
              <Sparkles size={16} />
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm tracking-tight text-gray-900 dark:text-white block leading-none uppercase">CraftResume</span>
              <span className="text-[10px] text-gray-400 font-bold font-mono">ATS-OPTIMIZED v1.0</span>
            </div>
          </div>

          {/* Builder Tab Switchers */}
          <div className="flex bg-gray-100 dark:bg-zinc-900/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'resume'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-850 dark:text-zinc-400'
              }`}
            >
              <Sparkles size={13} />
              <span>Resume Builder</span>
            </button>
            <button
              onClick={() => setActiveTab('cover-letter')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cover-letter'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-850 dark:text-zinc-400'
              }`}
            >
              <FileText size={13} />
              <span>Cover Letter</span>
            </button>
          </div>

          {/* Core Controls: Undo, Redo, Theme */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <Redo2 size={16} />
            </button>
            
            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800" />
            
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Sub-toolbar: Template Switcher & Accent Colors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 mb-6 bg-white dark:bg-zinc-950/80 rounded-2xl border border-gray-250/50 dark:border-zinc-900 shadow-sm">
          
          {/* Template Selectors (only relevant in Resume tab) */}
          <div className="flex items-center gap-2">
            {activeTab === 'resume' ? (
              <>
                <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase font-mono mr-1">Template:</span>
                {['professional', 'modern', 'minimal'].map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setActiveTemplate(temp as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      activeTemplate === temp
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                        : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    {temp}
                  </button>
                ))}
              </>
            ) : (
              <div className="text-xs font-bold text-indigo-650 dark:text-indigo-400 flex items-center gap-1">
                <FileText size={14} />
                <span>Stationery Cover Letter Styling</span>
              </div>
            )}
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-gray-455 dark:text-zinc-550" />
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase font-mono mr-1">Accent:</span>
            <div className="flex gap-1.5">
              {(['indigo', 'emerald', 'violet', 'rose', 'slate'] as const).map((color) => {
                const colorsMap = {
                  indigo: 'bg-indigo-500',
                  emerald: 'bg-emerald-500',
                  violet: 'bg-violet-500',
                  rose: 'bg-rose-500',
                  slate: 'bg-slate-600'
                };
                return (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-5 h-5 rounded-full ${colorsMap[color]} transition-transform ${
                      accentColor === color ? 'scale-125 ring-2 ring-indigo-500/20 dark:ring-white/40' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={color}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Tools: Import, Export, Reset */}
          <div className="flex flex-wrap items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleJsonImport} 
              accept=".json" 
              className="hidden" 
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-zinc-350 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 transition-all"
            >
              <Upload size={12} />
              <span>Import JSON</span>
            </button>

            <button
              onClick={handleJsonExport}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-zinc-350 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 transition-all"
            >
              <FileJson size={12} />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-red-200/50 dark:border-red-950/20 transition-all"
            >
              <Trash2 size={12} />
              <span>Reset</span>
            </button>

            <button
              onClick={handleDocxExport}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg border border-indigo-200/50 dark:border-indigo-950/20 transition-all"
            >
              <FileText size={12} />
              <span>Export DOCX</span>
            </button>

            <button
              onClick={handlePdfExport}
              className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-150 transition-all ml-1.5"
            >
              <FileDown size={12} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Hand: Wizard form or Cover Letter details */}
          <div className="lg:col-span-5 space-y-6">
            {activeTab === 'resume' ? (
              <>
                <ResumeForm onOpenAiEnhancer={openAiEnhancer} />
                <ScoreMeter />
              </>
            ) : (
              <CoverLetterForm />
            )}
          </div>

          {/* Right Hand: Live Scalable Preview Container */}
          <div className="lg:col-span-7 sticky top-24">
            {activeTab === 'resume' ? <ResumePreview /> : <CoverLetterPreview />}
          </div>
        </div>
      </main>

      {/* Popup AI enhancements drawers */}
      <AiTools
        isOpen={aiDrawer.isOpen}
        type={aiDrawer.type}
        targetId={aiDrawer.targetId}
        initialText={aiDrawer.text}
        onClose={() => setAiDrawer(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
export default App;
