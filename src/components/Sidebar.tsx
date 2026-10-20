import React from 'react';
import {
  GraduationCap,
  MessageSquare,
  FileScan,
  Video,
  Film,
  Code2,
  BrainCircuit,
  BarChart3,
  Settings as SettingsIcon,
  Flame,
  Sparkles,
  BookMarked,
  Sun,
  Moon,
} from 'lucide-react';
import { Subject } from '../types';

export type NavTab =
  | 'home'
  | 'chat'
  | 'vision'
  | 'video-generator'
  | 'video-library'
  | 'coding'
  | 'quiz'
  | 'progress'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  streakDays: number;
  selectedSubject: Subject;
  onSelectSubject: (sub: Subject) => void;
  hasApiKey: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  streakDays,
  selectedSubject,
  onSelectSubject,
  hasApiKey,
}) => {
  const navItems = [
    { id: 'home' as NavTab, label: 'Dashboard', icon: GraduationCap, badge: null },
    { id: 'chat' as NavTab, label: 'AI Tutor Chat', icon: MessageSquare, badge: 'Ask' },
    { id: 'vision' as NavTab, label: 'Scan & Analyze Page', icon: FileScan, badge: 'OCR' },
    { id: 'video-generator' as NavTab, label: 'Generate Video', icon: Video, badge: 'AI Video' },
    { id: 'video-library' as NavTab, label: 'Video Library', icon: Film, badge: null },
    { id: 'coding' as NavTab, label: 'Coding Tutor', icon: Code2, badge: 'New' },
    { id: 'quiz' as NavTab, label: 'Quizzes & Practice', icon: BrainCircuit, badge: null },
    { id: 'progress' as NavTab, label: 'Learning Progress', icon: BarChart3, badge: null },
    { id: 'settings' as NavTab, label: 'Settings', icon: SettingsIcon, badge: null },
  ];

  const subjects: Subject[] = [
    'General',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'History',
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none flex-shrink-0 z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              StudyMate <span className="text-cyan-400 font-black">AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Personal AI Teacher</p>
          </div>
        </div>
      </div>

      {/* Streak & Active Subject Bar */}
      <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>{streakDays} Day Streak</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Online</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Learning Studio
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badge === 'AI Video'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Subjects Switcher Section */}
        <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Current Subject</span>
          <BookMarked className="w-3.5 h-3.5" />
        </div>
        <div className="space-y-0.5 px-1">
          {subjects.slice(0, 5).map((sub) => (
            <button
              key={sub}
              onClick={() => onSelectSubject(sub)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedSubject === sub
                  ? 'text-cyan-300 bg-cyan-950/40 font-semibold border-l-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{sub}</span>
              {selectedSubject === sub && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              hasApiKey ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
            }`}
          />
          <span className="font-mono text-[11px]">
            {hasApiKey ? 'Gemini 3.8 Ready' : 'Demo API Mode'}
          </span>
        </div>
        <button
          onClick={() => onSelectTab('settings')}
          className="text-slate-400 hover:text-white transition-colors"
          title="App Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
