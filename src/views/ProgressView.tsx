import React from 'react';
import {
  BarChart3,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Video,
  Target,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { UserStats, Subject } from '../types';

interface ProgressViewProps {
  stats: UserStats;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ stats }) => {
  const subjectMastery: { subject: Subject; percent: number; color: string }[] = [
    { subject: 'Mathematics', percent: 84, color: 'bg-indigo-500' },
    { subject: 'Physics', percent: 72, color: 'bg-cyan-500' },
    { subject: 'Computer Science', percent: 91, color: 'bg-emerald-500' },
    { subject: 'Biology', percent: 65, color: 'bg-emerald-600' },
    { subject: 'Chemistry', percent: 58, color: 'bg-purple-500' },
    { subject: 'History', percent: 80, color: 'bg-amber-500' },
  ];

  const badges = [
    { title: 'Visual Learner', desc: 'Generated 5+ educational videos', icon: '🎬', earned: true },
    { title: 'Streak Champion', desc: 'Maintained 7-day study streak', icon: '🔥', earned: true },
    { title: 'Bug Hunter', desc: 'Debugged 3 coding problems in tutor', icon: '🐞', earned: true },
    { title: 'Formula Master', desc: 'Scored 100% on a math & science quiz', icon: '📐', earned: true },
    { title: 'Omni Scholar', desc: 'Studied across 5 academic subjects', icon: '🎓', earned: false },
    { title: 'Exam Ready', desc: 'Completed 20 practice questions', icon: '🏆', earned: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Academic Analytics & Skill Tracker</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Learning Progress & Milestones
        </h2>
        <p className="text-slate-400 text-sm">
          Monitor your study streaks, topic mastery, quiz accuracy, and completed video lessons.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Daily Streak</span>
            <h4 className="text-2xl font-black text-white">{stats.streakDays} Days</h4>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Videos Generated</span>
            <h4 className="text-2xl font-black text-white">{stats.videosGenerated}</h4>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Quiz Accuracy</span>
            <h4 className="text-2xl font-black text-white">{stats.quizAccuracy}%</h4>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Study Time</span>
            <h4 className="text-2xl font-black text-white">{Math.round(stats.studyMinutes / 60)} hrs</h4>
          </div>
        </div>
      </div>

      {/* Two Columns: Subject Mastery on Left, Badges & Activity on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Subject Mastery Progress Bars */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Subject Competency & Mastery</span>
            </h3>
            <span className="text-xs text-slate-400">Based on quiz results & video lessons</span>
          </div>

          <div className="space-y-4">
            {subjectMastery.map((item) => (
              <div key={item.subject} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.subject}</span>
                  <span className="font-mono text-cyan-300">{item.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Teacher Recommendation Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-2">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              StudyMate AI Personal Recommendation
            </span>
            <p className="text-slate-300 leading-relaxed">
              Your computer science and math reasoning scores are stellar! Spend 20 minutes reviewing
              organic chemistry functional groups to balance your weekly mastery.
            </p>
          </div>
        </div>

        {/* Academic Badges & Achievements */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Academic Badges & Achievements</span>
            </h3>
            <span className="text-xs text-amber-400 font-semibold">
              {badges.filter((b) => b.earned).length} / {badges.length} Earned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  b.earned
                    ? 'bg-slate-950 border-amber-500/30 text-white'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div>
                  <h5 className="font-bold text-xs">{b.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
