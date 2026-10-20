import { apiService } from '../services/api';

class SpeechManager {
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeakingState = false;

  public async speakText(
    text: string,
    options?: {
      voiceName?: string;
      onBoundary?: (charIndex: number) => void;
      onEnd?: () => void;
      audioContext?: AudioContext;
      destinationNode?: MediaStreamAudioDestinationNode;
    }
  ): Promise<void> {
    this.stop();
    this.isSpeakingState = true;

    // Clean markdown symbols from spoken text for natural diction
    const cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/```[\s\S]*?```/g, 'Code block omitted for brevity.')
      .trim();

    if (!cleanText) {
      this.isSpeakingState = false;
      options?.onEnd?.();
      return;
    }

    try {
      // Try Gemini TTS first
      const audioUrl = await apiService.synthesizeSpeech(cleanText, options?.voiceName || 'Kore');
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        if (options?.audioContext && options?.destinationNode) {
          try {
            const source = options.audioContext.createMediaElementSource(audio);
            source.connect(options.destinationNode);
            source.connect(options.audioContext.destination);
          } catch (e) {
            console.warn('Audio node routing warning:', e);
          }
        }

        audio.onended = () => {
          this.isSpeakingState = false;
          options?.onEnd?.();
        };

        audio.onerror = () => {
          this.speakNative(cleanText, options);
        };

        await audio.play();
        return;
      }
    } catch {
      // Fallback to browser SpeechSynthesis
    }

    this.speakNative(cleanText, options);
  }

  private speakNative(
    text: string,
    options?: {
      voiceName?: string;
      onBoundary?: (charIndex: number) => void;
      onEnd?: () => void;
    }
  ) {
    if (!('speechSynthesis' in window)) {
      this.isSpeakingState = false;
      options?.onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Select natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) &&
        v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onboundary = (e) => {
      options?.onBoundary?.(e.charIndex);
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeakingState = false;
      options?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    this.isSpeakingState = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const speechManager = new SpeechManager();
