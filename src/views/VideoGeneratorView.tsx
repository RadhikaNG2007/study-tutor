import React, { useState, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Mic,
  Palette,
  Layers,
  ArrowRight,
  Bookmark,
  Share2,
  HelpCircle,
  Upload,
} from 'lucide-react';
import { VideoScript, VideoStyle, Subject, SavedVideo } from '../types';
import { apiService } from '../services/api';
import { VideoCanvasPlayer } from '../components/VideoCanvasPlayer';

interface VideoGeneratorViewProps {
  initialTopic?: string;
  initialContext?: string;
  initialImage?: string;
  onSaveToLibrary: (video: SavedVideo) => void;
  onNavigateToLibrary: () => void;
}

export const VideoGeneratorView: React.FC<VideoGeneratorViewProps> = ({
  initialTopic = '',
  initialContext = '',
  initialImage,
  onSaveToLibrary,
  onNavigateToLibrary,
}) => {
  const [topic, setTopic] = useState<string>(initialTopic || 'Pythagorean Theorem: Visual Proof & Real World Intuition');
  const [context, setContext] = useState<string>(initialContext || '');
  const [videoStyle, setVideoStyle] = useState<VideoStyle>('animated_teacher');
  const [durationSec, setDurationSec] = useState<number>(60);
  const [voice, setVoice] = useState<string>('Kore');
  const [language, setLanguage] = useState<string>('English');

  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialContext) setContext(initialContext);
  }, [initialTopic, initialContext]);

  const styleOptions: { id: VideoStyle; name: string; desc: string; icon: string }[] = [
    {
      id: 'animated_teacher',
      name: 'Animated Teacher',
      desc: 'Interactive Dr. StudyMate avatar with lip-sync, gestures & laser pointer',
      icon: '🎓',
    },
    {
      id: 'whiteboard',
      name: 'Whiteboard Explanation',
      desc: 'Dynamic chalk/marker sketching, equations, and mathematical grids',
      icon: '📐',
    },
    {
      id: '3d_animation',
      name: '3D & Geometric',
      desc: 'Kinetic orbits, rotating wireframes, and vector depth coordinates',
      icon: '🌐',
    },
    {
      id: 'presentation',
      name: 'Presentation & Slides',
      desc: 'Executive glassmorphism slide decks with progressive bullet reveals',
      icon: '📊',
    },
    {
      id: 'storytelling',
      name: 'Storytelling Journey',
      desc: 'Narrative-driven concept exploration with real-world analogies',
      icon: '📖',
    },
    {
      id: 'short_revision',
      name: 'Short Revision Reel',
      desc: 'High-energy 45-60s rapid formula review & exam cues',
      icon: '⚡',
    },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      setIsGeneratingScript(true);
      setErrorMsg(null);
      setIsSaved(false);

      const generatedScript = await apiService.generateVideoScript(topic, {
        context: context.trim() || undefined,
        style: videoStyle,
        durationSec,
        language,
      });

      setScript(generatedScript);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate video script.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleSaveVideo = () => {
    if (!script) return;

    const saved: SavedVideo = {
      id: `vid_${Date.now()}`,
      title: script.title || topic,
      topic,
      subject: 'General',
      style: videoStyle,
      durationSec: script.totalDurationSec || durationSec,
      createdAt: new Date().toLocaleDateString(),
      script,
      sourceImage: initialImage,
      viewsCount: 1,
    };

    onSaveToLibrary(saved);
    setIsSaved(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Video className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive AI Educational Video Studio</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Photo-to-Explanation Video Generator
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          Transform any topic, photo, or textbook theorem into a fully narrated educational video
          with real-time canvas animation, voice-over, captions, and downloadable video file.
        </p>
      </div>

      {/* Two Column Layout: Setup on Left, Video Player on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Configuration */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/70 border border-slate-800 p-6 rounded-3xl">
          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Academic Topic / Concept</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Newton's 2nd Law of Motion: F = ma"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
            />
          </div>

          {/* Context / Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Specific Questions or Page Context (Optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              placeholder="Include notes from textbook page or specific formulas to highlight..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none shadow-inner"
            />
          </div>

          {/* Style Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Choose Educational Video Style</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setVideoStyle(opt.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    videoStyle === opt.id
                      ? 'bg-indigo-600/20 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
                    <span>{opt.icon}</span>
                    <span className="truncate">{opt.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Voice, Language & Duration controls */}
          <div className="grid grid-cols-3 gap-3">
            {/* Duration */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Duration
              </label>
              <select
                value={durationSec}
                onChange={(e) => setDurationSec(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
              >
                <option value="45">45s (Fast)</option>
                <option value="60">60s (Standard)</option>
                <option value="90">90s (Detailed)</option>
              </select>
            </div>

            {/* Voice */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Voice Actor
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
              >
                <option value="Kore">Kore (Warm)</option>
                <option value="Zephyr">Zephyr (Bright)</option>
                <option value="Puck">Puck (Curious)</option>
                <option value="Fenrir">Fenrir (Authoritative)</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-400"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || isGeneratingScript}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-40 transition-all hover:scale-[1.01]"
          >
            {isGeneratingScript ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>Synthesizing Scenes & Narration...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Explanatory Video</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 text-xs bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Right Column: Built-in Video Player & Storyboard */}
        <div className="lg:col-span-7 space-y-6">
          {script ? (
            <div className="space-y-4">
              {/* The Real Canvas Video Player */}
              <VideoCanvasPlayer script={script} autoPlay={true} />

              {/* Action Bar below player */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveVideo}
                    disabled={isSaved}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSaved
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{isSaved ? 'Saved in Library' : 'Save to Video Library'}</span>
                  </button>

                  <button
                    onClick={onNavigateToLibrary}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    View All Videos →
                  </button>
                </div>

                <div className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                  {script.scenes.length} Scenes • {script.totalDurationSec}s
                </div>
              </div>

              {/* Scene Storyboard Overview */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Scene Breakdown & Narration Script</span>
                </h4>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {script.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-cyan-300">
                          Scene {idx + 1}: {scene.title}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {scene.durationSec}s
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        “{scene.narration}”
                      </p>
                      {scene.formulaOrCode && (
                        <div className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-1 rounded inline-block">
                          {scene.formulaOrCode}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Blank Studio Viewport */
            <div className="aspect-video w-full rounded-3xl bg-slate-900/40 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
                <Video className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h4 className="font-bold text-white text-base">Video Generation Studio</h4>
                <p className="text-xs text-slate-400">
                  Select a topic or choose your preferred video style on the left, then click
                  "Generate Explanatory Video" to see the real-time canvas animation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
