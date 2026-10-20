import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Video,
  HelpCircle,
  BookOpen,
  ArrowDownCircle,
  RotateCcw,
  Code,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, Subject } from '../types';
import { apiService } from '../services/api';
import { speechManager } from '../utils/speech';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, mode?: string) => Promise<void>;
  isLoading: boolean;
  selectedSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
  onTurnIntoVideo: (topic: string, context: string) => void;
  onClearChat: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  selectedSubject,
  onSelectSubject,
  onTurnIntoVideo,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const quickPrompts = [
    { label: 'Explain Schrödinger’s Cat', prompt: 'Explain Schrödinger’s Cat paradox simply with an analogy' },
    { label: 'Calculus: Chain Rule', prompt: 'Teach me the Calculus Chain Rule step-by-step with 2 examples' },
    { label: 'Python Recursion', prompt: 'Explain how recursion works in Python line by line with visual call stack' },
    { label: 'Mitochondria vs Chloroplast', prompt: 'Compare mitochondria and chloroplasts for an exam answer' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (speakingId === id) {
      speechManager.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      speechManager.speakText(text, {
        voiceName: 'Kore',
        onEnd: () => setSpeakingId(null),
      });
    }
  };

  const handleExplainSimply = (originalMsg: ChatMessage) => {
    const prompt = `Please explain the previous answer much more simply, using everyday analogies and simple 5th-grade level terms. Answer to simplify: "${originalMsg.content.slice(0, 300)}..."`;
    onSendMessage(prompt, 'Explain Simply');
  };

  // Helper to render markdown-like text, code blocks, and bold highlights
  const renderFormattedText = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].includes(' ') ? '' : lines[0].trim();
        const code = lang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 font-mono text-xs">
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between text-slate-400 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                {lang || 'code'}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-[11px] hover:text-white flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format markdown headers, bullets, and bold text
      return (
        <div key={index} className="space-y-2 whitespace-pre-wrap leading-relaxed">
          {part}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Bar with Subject Filter and Clear Chat */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-wrap gap-3 z-10">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Subject:</span>
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => onSelectSubject(sub)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <button
          onClick={onClearChat}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Thread</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
              <Bot className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">How can I teach you today?</h3>
              <p className="text-slate-400 text-sm">
                I am your personal AI teacher. Ask any academic question, paste homework problems, or
                choose a starter prompt below:
              </p>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(item.prompt)}
                  className="text-left p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-xs text-slate-300 transition-all group"
                >
                  <div className="font-semibold text-white group-hover:text-cyan-300 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  <p className="text-slate-400 line-clamp-1">{item.prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/90 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`relative group rounded-2xl p-4 sm:p-5 text-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Mode / Subject Tag */}
                  {msg.mode && !isUser && (
                    <div className="inline-block mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                      {msg.mode}
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="prose prose-invert max-w-none text-sm font-normal">
                    {renderFormattedText(msg.content)}
                  </div>

                  {/* Assistant Action Bar */}
                  {!isUser && (
                    <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      {/* Explain more simply */}
                      <button
                        onClick={() => handleExplainSimply(msg)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors text-amber-300"
                        title="Explain in simpler terms"
                      >
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Explain Simply</span>
                      </button>

                      {/* Turn into video */}
                      <button
                        onClick={() =>
                          onTurnIntoVideo(
                            msg.content.slice(0, 60),
                            msg.content
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                        title="Generate animated video for this lesson"
                      >
                        <Video className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Make Video</span>
                      </button>

                      {/* Read Aloud */}
                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                          speakingId === msg.id
                            ? 'bg-indigo-600 text-white'
                            : 'hover:bg-slate-800 hover:text-white'
                        }`}
                        title="Read aloud"
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 animate-pulse text-red-300" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-3xl mr-auto items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>StudyMate AI is structuring your step-by-step answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-2">
          <div className="relative flex-1 bg-slate-950 border border-slate-700/80 rounded-2xl focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20 transition-all overflow-hidden">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={2}
              placeholder={`Ask any ${selectedSubject} question... (Shift+Enter for new line)`}
              className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shadow-md flex items-center justify-center flex-shrink-0"
            title="Send Message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
