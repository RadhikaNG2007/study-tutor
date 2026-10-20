import React from 'react';
import {
  Settings as SettingsIcon,
  Sparkles,
  ShieldCheck,
  Volume2,
  GraduationCap,
  Trash2,
  Moon,
  Sun,
  Check,
  ExternalLink,
} from 'lucide-react';

interface SettingsViewProps {
  hasApiKey: boolean;
  gradeLevel: string;
  onSetGradeLevel: (level: string) => void;
  preferredVoice: string;
  onSetPreferredVoice: (voice: string) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  hasApiKey,
  gradeLevel,
  onSetGradeLevel,
  preferredVoice,
  onSetPreferredVoice,
  onResetAllData,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
          <SettingsIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>App Preferences & API Configuration</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Settings</h2>
        <p className="text-slate-400 text-sm">
          Customize your personal AI teacher's explanation level, voice actor, and storage options.
        </p>
      </div>

      <div className="space-y-6">
        {/* Backend & AI API Connection Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>AI Studio Engine & API Key Status</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    hasApiKey ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
                  }`}
                />
                <span className="font-bold text-sm text-white">
                  {hasApiKey ? 'Gemini 3.8 Server API Connected' : 'Demo API Mode Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {hasApiKey
                  ? 'Your backend has a configured GEMINI_API_KEY running multimodal vision, OCR, and speech.'
                  : 'Add your GEMINI_API_KEY in Settings > Secrets to unlock full live multimodal quota.'}
              </p>
            </div>
          </div>
        </div>

        {/* Academic Level & Pedagogical Calibration */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Academic Level & Explanation Depth</span>
          </h3>
          <p className="text-xs text-slate-400">
            StudyMate AI adjusts math rigor, scientific terminology, and analogy complexity
            accordingly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'Middle School',
                label: 'Middle School (Grades 6-8)',
                desc: 'Vivid metaphors, intuitive visuals, minimal abstract jargon',
              },
              {
                id: 'High School',
                label: 'High School / AP Prep',
                desc: 'Standard curriculum rigor, step-by-step proofs & exam questions',
              },
              {
                id: 'Undergraduate',
                label: 'College / Undergraduate',
                desc: 'Formal theorems, time/space complexity, derivations',
              },
              {
                id: 'Professional',
                label: 'Advanced & Professional',
                desc: 'Concise, publication-level explanations and code optimizations',
              },
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => onSetGradeLevel(lvl.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  gradeLevel === lvl.id
                    ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm text-white mb-1">
                  <span>{lvl.label}</span>
                  {gradeLevel === lvl.id && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{lvl.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Persona */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-purple-400" />
            <span>AI Teacher Voice Persona</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'Kore', name: 'Kore', desc: 'Warm & Encouraging' },
              { id: 'Zephyr', name: 'Zephyr', desc: 'Energetic & Bright' },
              { id: 'Puck', name: 'Puck', desc: 'Inquisitive & Lively' },
              { id: 'Fenrir', name: 'Fenrir', desc: 'Calm & Authoritative' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => onSetPreferredVoice(v.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  preferredVoice === v.id
                    ? 'bg-purple-600/20 border-purple-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white mb-0.5">{v.name}</div>
                <p className="text-[11px] text-slate-400">{v.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Storage and Data Reset */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4 shadow-xl">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            <span>Storage & Cache Management</span>
          </h3>
          <p className="text-xs text-slate-400">
            Clear all saved video scripts, chat conversations, and quiz history from local storage.
          </p>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear your local study history?')) {
                onResetAllData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Study History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
