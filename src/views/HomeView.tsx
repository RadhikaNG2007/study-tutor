import React, { useState } from 'react';
import {
  Video,
  FileScan,
  MessageSquare,
  Code2,
  Sparkles,
  ArrowRight,
  Play,
  BrainCircuit,
  Flame,
  Award,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { NavTab } from '../components/Sidebar';
import { Subject, SavedVideo } from '../types';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onQuickAsk: (prompt: string, subject?: Subject) => void;
  onStartVideoTopic: (topic: string) => void;
  savedVideos: SavedVideo[];
  streakDays: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onQuickAsk,
  onStartVideoTopic,
  savedVideos,
  streakDays,
}) => {
  const [askInput, setAskInput] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askInput.trim()) return;
    onQuickAsk(askInput.trim());
  };

  const recommendedTopics = [
    {
      title: 'Pythagorean Theorem: Visual Intuition',
      subject: 'Mathematics' as Subject,
      duration: '60s',
      tag: 'Geometry',
    },
    {
      title: 'How Photosynthesis Powers Life on Earth',
      subject: 'Biology' as Subject,
      duration: '75s',
      tag: 'Cellular Bio',
    },
    {
      title: 'Binary Search: Why O(log n) is Lightning Fast',
      subject: 'Computer Science' as Subject,
      duration: '60s',
      tag: 'Algorithms',
    },
    {
      title: "Newton's 3 Laws of Motion via Rollercoasters",
      subject: 'Physics' as Subject,
      duration: '90s',
      tag: 'Mechanics',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950">
      {/* Hero Welcome & Quick Search Bar */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen Visual AI Tutoring</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Understand any academic topic with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              Interactive Videos & 1-on-1 AI Tutoring
            </span>
          </h2>

          <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
            Upload a textbook photo, paste a coding challenge, or ask any concept. StudyMate AI
            breaks it down step-by-step and generates full animated educational videos on demand.
          </p>

          {/* Quick Ask Bar */}
          <form onSubmit={handleAskSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                placeholder="Ask any question (e.g. 'Explain how neural backpropagation works with an analogy')"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Ask Tutor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* 4 Feature Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Video Generator */}
        <div
          onClick={() => onNavigate('video-generator')}
          className="group relative bg-slate-900/70 hover:bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
              Generate Video
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn any topic, textbook page, or handwritten notes into an animated whiteboard video
              with voice-over.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1 text-xs text-cyan-400 font-semibold">
            <span>Create Video</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Vision & OCR */}
        <div
          onClick={() => onNavigate('vision')}
          className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileScan className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-300 transition-colors">
              Scan Page & OCR
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload photos of homework, diagrams, charts, or exams. Instant step-by-step
              breakdowns.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1 text-xs text-indigo-400 font-semibold">
            <span>Scan Document</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: AI Chat Tutor */}
        <div
          onClick={() => onNavigate('chat')}
          className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-purple-500 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-purple-300 transition-colors">
              AI Tutor Chat
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ChatGPT-style academic dialog. Exam answers, formulas, and simple explanations.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1 text-xs text-purple-400 font-semibold">
            <span>Start Chat</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Coding Tutor */}
        <div
          onClick={() => onNavigate('coding')}
          className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500 p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white mb-1 group-hover:text-emerald-300 transition-colors">
              Coding Tutor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Line-by-line code explanation, debugging screenshots, and execution walkthrough in
              Python, C++, Java, JS.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1 text-xs text-emerald-400 font-semibold">
            <span>Debug Code</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Recommended Explanatory Video Topics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg text-white">Popular Topics to Watch & Learn</h3>
          </div>
          <button
            onClick={() => onNavigate('video-generator')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Custom Topic</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedTopics.map((topic, i) => (
            <div
              key={i}
              onClick={() => onStartVideoTopic(topic.title)}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:bg-slate-850 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {topic.subject}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {topic.duration}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                  {topic.title}
                </h4>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-300">
                <span>Generate Video</span>
                <div className="w-7 h-7 rounded-full bg-slate-800 group-hover:bg-cyan-500/20 flex items-center justify-center transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Videos & Learning Streak Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Videos Preview */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>Your Educational Video Library</span>
            </h3>
            <button
              onClick={() => onNavigate('video-library')}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              View All ({savedVideos.length})
            </button>
          </div>

          {savedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedVideos.slice(0, 2).map((v) => (
                <div
                  key={v.id}
                  onClick={() => onNavigate('video-library')}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Play className="w-5 h-5 text-indigo-400 fill-indigo-400/30" />
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="text-xs font-semibold text-white truncate">{v.title}</h5>
                    <p className="text-[11px] text-slate-400">{v.subject} • {v.style}</p>
                    <span className="text-[10px] text-slate-500">{v.durationSec}s duration</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No videos saved yet. Click "Generate Video" to create your first lesson!
            </div>
          )}
        </div>

        {/* Learning Stats Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Learning Milestones</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Active Streak
              </span>
              <span className="font-bold text-amber-400">{streakDays} Days</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                Videos Generated
              </span>
              <span className="font-bold text-white">{savedVideos.length}</span>
            </div>

            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                Tutor Level
              </span>
              <span className="font-bold text-purple-300">Level 3 Scholar</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('progress')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Detailed Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
