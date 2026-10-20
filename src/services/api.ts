import {
  ChatMessage,
  ImageAnalysisResult,
  VideoScript,
  VideoStyle,
  QuizQuestion,
  CodeAnalysisResult,
  Subject,
} from '../types';

export const apiService = {
  // Check backend health
  async checkHealth(): Promise<{ status: string; hasApiKey: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'offline', hasApiKey: false };
    }
  },

  // 1. Send Chat message
  async sendChat(
    messages: { role: string; content: string }[],
    options?: { subject?: Subject; mode?: string; level?: string }
  ): Promise<string> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          subject: options?.subject || 'General',
          mode: options?.mode || 'Standard Tutor',
          level: options?.level || 'Undergraduate',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reach AI Tutor');
      }
      return data.reply;
    } catch (err: any) {
      console.warn('API chat fallback:', err.message);
      // Helpful fallback response if API is unreachable
      return `### 💡 StudyMate AI Tutor Note
I encountered a temporary connection issue (${err.message}).

Here is a quick guidance on your topic:
1. **Core Concept**: Break the problem down into its fundamentals.
2. **Step-by-Step**: First identify known variables, state the governing equation or rule, and solve systematically.
3. **Tip**: Try the "Explain More Simply" or "Generate Video" option to visualize this step-by-step!`;
    }
  },

  // 2. Multimodal Image Analysis
  async analyzeImage(
    imageBase64: string,
    prompt?: string,
    mode: 'teach_page' | 'extract_ocr' | 'solve_problem' | 'general' = 'general'
  ): Promise<ImageAnalysisResult> {
    const res = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        prompt,
        mode,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to analyze academic image');
    }
    return data;
  },

  // 3. Generate Video Script
  async generateVideoScript(
    topic: string,
    options?: {
      context?: string;
      style?: VideoStyle;
      durationSec?: number;
      language?: string;
    }
  ): Promise<VideoScript> {
    const res = await fetch('/api/generate-video-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        context: options?.context,
        style: options?.style || 'whiteboard',
        durationSec: options?.durationSec || 60,
        language: options?.language || 'English',
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate video script');
    }
    return data;
  },

  // 4. TTS audio synthesis
  async synthesizeSpeech(text: string, voice = 'Kore'): Promise<string | null> {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      const data = await res.json();
      if (!res.ok || !data.audioBase64) {
        return null;
      }
      return `data:audio/wav;base64,${data.audioBase64}`;
    } catch {
      return null;
    }
  },

  // 5. Generate Quiz
  async generateQuiz(
    topic: string,
    subject?: string,
    count = 4,
    difficulty = 'medium'
  ): Promise<QuizQuestion[]> {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subject, count, difficulty }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate quiz');
    }
    return data.questions || [];
  },

  // 6. Code Tutor
  async analyzeCode(
    code: string,
    language = 'Python',
    task: 'explain' | 'debug_fix' | 'optimize' | 'step_by_step' = 'explain'
  ): Promise<CodeAnalysisResult> {
    const res = await fetch('/api/code-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language, task }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to analyze code snippet');
    }
    return data;
  },
};
