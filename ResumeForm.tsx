import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import type { SectionType } from '../types';
import { 
  User, Briefcase, GraduationCap, Code2, Award, 
  Globe, Trash2, Plus, ArrowLeft, ArrowRight, 
  Sparkles, Check, ChevronUp, ChevronDown 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface FormProps {
  onOpenAiEnhancer: (type: 'summary' | 'experience', targetId?: string, text?: string) => void;
}

export const ResumeForm: React.FC<FormProps> = ({ onOpenAiEnhancer }) => {
  const {
    resumeData,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertification,
    updateCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    setSectionsOrder,
  } = useResumeStore();

  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { label: 'Profile', icon: User },
    { label: 'Experience', icon: Briefcase },
    { label: 'Education', icon: GraduationCap },
    { label: 'Projects & Skills', icon: Code2 },
    { label: 'Extras', icon: Award },
    { label: 'Section Order', icon: Globe },
  ];

  // Simple validation checks
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!resumeData.personalInfo.fullName.trim()) {
        newErrors.fullName = 'Full Name is required.';
      }
      if (resumeData.personalInfo.email && !/\S+@\S+\.\S+/.test(resumeData.personalInfo.email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Section Reordering Helpers
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...resumeData.sectionsOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    
    // Swap elements
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    
    setSectionsOrder(newOrder);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950/80 rounded-2xl border border-gray-200/60 dark:border-zinc-800/80 overflow-hidden shadow-sm">
      {/* Step Indicators */}
      <div className="border-b border-gray-100 dark:border-zinc-800/50 p-4 bg-gray-50/50 dark:bg-zinc-900/10">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            const isCompleted = idx < activeStep;

            return (
              <button
                key={step.label}
                onClick={() => {
                  // Allow jumping to any previous step, or next step if valid
                  if (idx < activeStep || validateStep(activeStep)) {
                    setActiveStep(idx);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100 dark:shadow-none' 
                    : isCompleted
                      ? 'text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                      : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400 hover:dark:text-zinc-200'
                }`}
              >
                <Icon size={14} />
                <span>{step.label}</span>
                {isCompleted && <Check size={12} className="stroke-[3]" />}
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-6 overflow-y-auto min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {/* STEP 0: PERSONAL INFORMATION */}
            {activeStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 font-heading">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Full Name *</label>
                    <input 
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.fullName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Professional Title</label>
                    <input 
                      type="text"
                      value={resumeData.personalInfo.professionalTitle}
                      onChange={(e) => updatePersonalInfo({ professionalTitle: e.target.value })}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Email</label>
                    <input 
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Phone</label>
                    <input 
                      type="text"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      placeholder="e.g. +1 (555) 000-0000"
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Location</label>
                    <input 
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">LinkedIn Profile</label>
                    <input 
                      type="text"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">GitHub Profile</label>
                    <input 
                      type="text"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                      placeholder="github.com/username"
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase mb-1">Portfolio / Website</label>
                    <input 
                      type="text"
                      value={resumeData.personalInfo.portfolio}
                      onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
                      placeholder="e.g. website.dev"
                      className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="relative mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Professional Summary</label>
                    <button 
                      type="button"
                      onClick={() => onOpenAiEnhancer('summary', undefined, resumeData.personalInfo.professionalTitle)}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full transition-all"
                    >
                      <Sparkles size={10} />
                      <span>AI Generate</span>
                    </button>
                  </div>
                  <textarea 
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                    rows={4}
                    placeholder="Brief summary of your professional milestones, key skill areas, and career objective..."
                    className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                  />
                </div>
              </div>
            )}

            {/* STEP 1: WORK EXPERIENCE */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 font-heading">Work Experience</h3>
                  <button
                    type="button"
                    onClick={() => addExperience({
                      company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: ''
                    })}
                    className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow-sm shadow-indigo-150 transition-all"
                  >
                    <Plus size={14} /> Add Role
                  </button>
                </div>

                {resumeData.experience.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-center">
                    <Briefcase size={28} className="text-gray-400 dark:text-zinc-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">No experiences listed yet</p>
                    <p className="text-xs text-gray-400 max-w-[200px] mt-0.5">Click the "Add Role" button to document your work experience.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/30 dark:bg-zinc-900/30 relative group">
                        <button
                          type="button"
                          onClick={() => deleteExperience(exp.id)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 dark:text-zinc-500 hover:dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Job Title</label>
                            <input 
                              type="text"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                              placeholder="e.g. Senior Frontend Engineer"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Company</label>
                            <input 
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                              placeholder="e.g. Stripe"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Location</label>
                            <input 
                              type="text"
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                              placeholder="e.g. Remote / New York"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Start Date</label>
                              <input 
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">End Date</label>
                              <input 
                                type="month"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <input 
                            type="checkbox" 
                            id={`curr-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                          />
                          <label htmlFor={`curr-${exp.id}`} className="text-xs text-gray-600 dark:text-zinc-400 font-medium">I currently work here</label>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase">Role Description</label>
                            <button
                              type="button"
                              onClick={() => onOpenAiEnhancer('experience', exp.id, exp.description)}
                              className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full transition-all"
                            >
                              <Sparkles size={10} />
                              <span>AI Enhance Bullet</span>
                            </button>
                          </div>
                          <textarea 
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                            rows={3}
                            placeholder="Add bullet points describing achievements and responsibilities (e.g. Led design of responsive layout boosting click conversions by 15%)..."
                            className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: EDUCATION HISTORY */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 font-heading">Education History</h3>
                  <button
                    type="button"
                    onClick={() => addEducation({
                      institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', current: false, description: ''
                    })}
                    className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition-all"
                  >
                    <Plus size={14} /> Add Education
                  </button>
                </div>

                {resumeData.education.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl text-center">
                    <GraduationCap size={28} className="text-gray-400 dark:text-zinc-600 mb-2" />
                    <p className="text-sm font-semibold text-gray-500 dark:text-zinc-400">No education entries listed yet</p>
                    <p className="text-xs text-gray-400 max-w-[200px] mt-0.5">Click the button above to register your degrees or certifications.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/30 dark:bg-zinc-900/30 relative group">
                        <button
                          type="button"
                          onClick={() => deleteEducation(edu.id)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 dark:text-zinc-500 hover:dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">School / Institution</label>
                            <input 
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                              placeholder="e.g. UC Berkeley"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Degree</label>
                            <input 
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                              placeholder="e.g. Bachelor of Science"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Field of Study</label>
                            <input 
                              type="text"
                              value={edu.fieldOfStudy}
                              onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                              placeholder="e.g. Computer Science"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Location</label>
                            <input 
                              type="text"
                              value={edu.location}
                              onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                              placeholder="e.g. Berkeley, CA"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Start Date</label>
                              <input 
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">End Date</label>
                              <input 
                                type="month"
                                value={edu.endDate}
                                disabled={edu.current}
                                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none disabled:opacity-50"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <input 
                            type="checkbox" 
                            id={`curr-edu-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, { current: e.target.checked })}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                          />
                          <label htmlFor={`curr-edu-${edu.id}`} className="text-xs text-gray-600 dark:text-zinc-400 font-medium">I am currently studying here</label>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Brief Notes / GPA / Activities</label>
                          <textarea 
                            value={edu.description}
                            onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                            rows={2}
                            placeholder="Additional details e.g. GPA 3.9, President of Computer Society..."
                            className="w-full px-3 py-2 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PROJECTS & SKILLS */}
            {activeStep === 3 && (
              <div className="space-y-6">
                {/* PROJECTS SUBSECTION */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-gray-900 dark:text-zinc-100 font-heading">Key Projects</h3>
                    <button
                      type="button"
                      onClick={() => addProject({
                        name: '', role: '', description: '', technologies: '', url: ''
                      })}
                      className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-lg shadow-sm transition-all"
                    >
                      <Plus size={12} /> Add Project
                    </button>
                  </div>

                  {resumeData.projects.length > 0 && (
                    <div className="space-y-4">
                      {resumeData.projects.map((proj) => (
                        <div key={proj.id} className="p-4 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/30 dark:bg-zinc-900/30 relative group">
                          <button
                            type="button"
                            onClick={() => deleteProject(proj.id)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-red-500 dark:text-zinc-500 hover:dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Project Name</label>
                              <input 
                                type="text"
                                value={proj.name}
                                onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                                placeholder="e.g. Analytics Platform"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Your Role</label>
                              <input 
                                type="text"
                                value={proj.role}
                                onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                                placeholder="e.g. Creator / Full Stack Lead"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">URL / Link</label>
                              <input 
                                type="text"
                                value={proj.url}
                                onChange={(e) => updateProject(proj.id, { url: e.target.value })}
                                placeholder="e.g. github.com/user/project"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Technologies Used</label>
                              <input 
                                type="text"
                                value={proj.technologies}
                                onChange={(e) => updateProject(proj.id, { technologies: e.target.value })}
                                placeholder="e.g. React, Next.js, PostgreSQL"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">Description</label>
                            <textarea 
                              value={proj.description}
                              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                              rows={2}
                              placeholder="Describe what you built and the achievements of the project..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none resize-y"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SKILLS SUBSECTION */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-850">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-gray-900 dark:text-zinc-100 font-heading">Core Skills</h3>
                    <button
                      type="button"
                      onClick={() => addSkill({
                        name: '', level: 80, category: 'Frontend'
                      })}
                      className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-lg shadow-sm transition-all"
                    >
                      <Plus size={12} /> Add Skill
                    </button>
                  </div>

                  {resumeData.skills.length === 0 ? (
                    <p className="text-xs text-gray-400">No skills added yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {resumeData.skills.map((skill) => (
                        <div key={skill.id} className="p-3 border border-gray-100 dark:border-zinc-800 rounded-lg bg-gray-50/30 dark:bg-zinc-900/30 flex items-center justify-between gap-3 relative group">
                          <div className="flex-1 space-y-1">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={skill.name}
                                onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                                placeholder="e.g. React"
                                className="px-2 py-1 text-xs rounded border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none w-[110px]"
                              />
                              <input 
                                type="text"
                                value={skill.category}
                                onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                                placeholder="e.g. Frontend"
                                className="px-2 py-1 text-xs rounded border bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white focus:outline-none w-[90px]"
                              />
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={skill.level} 
                                onChange={(e) => updateSkill(skill.id, { level: parseInt(e.target.value) })}
                                className="h-1 w-24 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                              <span className="text-[10px] text-gray-500 font-mono font-bold">{skill.level}%</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteSkill(skill.id)}
                            className="text-gray-400 hover:text-red-500 dark:text-zinc-500 hover:dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: EXTRAS (CERTIFICATIONS, LANGUAGES, ACHIEVEMENTS) */}
            {activeStep === 4 && (
              <div className="space-y-6">
                {/* CERTIFICATIONS */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-gray-900 dark:text-zinc-100 font-heading">Certifications</h3>
                    <button
                      type="button"
                      onClick={() => addCertification({ name: '', issuer: '', date: '', url: '' })}
                      className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md"
                    >
                      <Plus size={12} /> Add Cert
                    </button>
                  </div>
                  {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="p-3 border border-gray-100 dark:border-zinc-800 rounded-lg bg-gray-50/30 dark:bg-zinc-900/30 flex justify-between items-start gap-2 relative group">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                        <input 
                          type="text" value={cert.name} 
                          onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                          placeholder="Cert Title" className="px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white"
                        />
                        <input 
                          type="text" value={cert.issuer} 
                          onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                          placeholder="Issuer (e.g. AWS)" className="px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white"
                        />
                        <input 
                          type="month" value={cert.date} 
                          onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                          className="px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white"
                        />
                        <input 
                          type="text" value={cert.url} 
                          onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                          placeholder="Verification URL" className="px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white"
                        />
                      </div>
                      <button type="button" onClick={() => deleteCertification(cert.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* LANGUAGES */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-gray-900 dark:text-zinc-100 font-heading">Languages</h3>
                    <button
                      type="button"
                      onClick={() => addLanguage({ name: '', proficiency: 'Fluent' })}
                      className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md"
                    >
                      <Plus size={12} /> Add Lang
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resumeData.languages.map((lang) => (
                      <div key={lang.id} className="p-2 border border-gray-100 dark:border-zinc-800 rounded-lg bg-gray-50/30 dark:bg-zinc-900/30 flex justify-between items-center gap-2 relative group">
                        <div className="flex gap-2">
                          <input 
                            type="text" value={lang.name} 
                            onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
                            placeholder="Language" className="px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white w-[110px]"
                          />
                          <select 
                            value={lang.proficiency}
                            onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
                            className="px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white"
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </select>
                        </div>
                        <button type="button" onClick={() => deleteLanguage(lang.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ACHIEVEMENTS */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800/50">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-gray-900 dark:text-zinc-100 font-heading">Achievements</h3>
                    <button
                      type="button"
                      onClick={() => addAchievement({ title: '', description: '', date: '' })}
                      className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md"
                    >
                      <Plus size={12} /> Add Achievement
                    </button>
                  </div>
                  {resumeData.achievements.map((ach) => (
                    <div key={ach.id} className="p-3 border border-gray-100 dark:border-zinc-800 rounded-xl bg-gray-50/30 dark:bg-zinc-900/30 relative group space-y-2">
                      <button
                        type="button"
                        onClick={() => deleteAchievement(ach.id)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input 
                          type="text" value={ach.title} 
                          onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                          placeholder="Achievement Title" className="px-2 py-1.5 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white"
                        />
                        <input 
                          type="month" value={ach.date} 
                          onChange={(e) => updateAchievement(ach.id, { date: e.target.value })}
                          className="px-2 py-1.5 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white"
                        />
                      </div>
                      <textarea 
                        value={ach.description} 
                        onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                        placeholder="Brief summary or description..." rows={2}
                        className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-950 dark:text-white resize-y"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: SECTION ORDERING */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 font-heading">Reorder Resume Sections</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Arrange the layout sequence of your resume sections. These changes immediately propagate to PDF and template configurations.
                </p>

                <div className="space-y-2 max-w-md">
                  {resumeData.sectionsOrder.map((section, index) => {
                    if (section === 'personal') return null; // Kept at the top boundary
                    
                    const labelMap: Record<SectionType, string> = {
                      personal: 'Personal Details',
                      experience: 'Work Experience',
                      education: 'Education',
                      projects: 'Key Projects',
                      skills: 'Core Skills',
                      certifications: 'Certifications',
                      languages: 'Languages',
                      achievements: 'Achievements'
                    };

                    return (
                      <div 
                        key={section}
                        className="flex items-center justify-between p-3 border border-gray-150 dark:border-zinc-800 rounded-lg bg-gray-55/20 dark:bg-zinc-900/40 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400">#0{index}</span>
                          <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200">{labelMap[section]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSection(index, 'up')}
                            disabled={index === 1}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(index, 'down')}
                            disabled={index === resumeData.sectionsOrder.length - 1}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav Actions Footer */}
      <div className="border-t border-gray-100 dark:border-zinc-800/50 p-4 bg-gray-50/50 dark:bg-zinc-900/10 flex justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeStep === 0}
          className="flex items-center gap-1 text-xs font-bold text-gray-600 dark:text-zinc-300 hover:text-gray-900 hover:dark:text-white px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 disabled:opacity-50 disabled:hover:text-gray-600 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft size={14} /> Prev
        </button>

        {activeStep === steps.length - 1 ? (
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check size={14} /> Fully Ready to Export!
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg shadow-sm transition-all"
          >
            Next <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
