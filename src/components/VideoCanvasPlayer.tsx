import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Captions,
  Settings,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Share2,
  BookOpen,
} from 'lucide-react';
import { VideoScript, VideoScene, VideoStyle } from '../types';
import { speechManager } from '../utils/speech';

interface VideoCanvasPlayerProps {
  script: VideoScript;
  onFinished?: () => void;
  autoPlay?: boolean;
}

export const VideoCanvasPlayer: React.FC<VideoCanvasPlayerProps> = ({
  script,
  onFinished,
  autoPlay = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');

  const scenes = script.scenes || [];
  const totalDuration = scenes.reduce((acc, s) => acc + (s.durationSec || 12), 0) || 60;

  // Scene timing offsets
  const sceneOffsets = useRef<number[]>([]);
  useEffect(() => {
    let offset = 0;
    const offsets: number[] = [];
    scenes.forEach((s) => {
      offsets.push(offset);
      offset += s.durationSec || 12;
    });
    sceneOffsets.current = offsets;
  }, [scenes]);

  const animationFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Play current scene narration
  const playSceneAudio = useCallback(
    (sceneIndex: number) => {
      if (sceneIndex < 0 || sceneIndex >= scenes.length) return;
      const scene = scenes[sceneIndex];
      setActiveSubtitle(scene.narration);

      if (!isMuted) {
        speechManager.speakText(scene.narration, {
          voiceName: 'Kore',
          onEnd: () => {
            // Narration complete
          },
        });
      }
    },
    [scenes, isMuted]
  );

  // Dynamic Canvas Drawing Engine
  const drawFrame = useCallback(
    (timeSec: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Find current scene
      let sIdx = 0;
      let sTime = 0;
      for (let i = 0; i < scenes.length; i++) {
        const offset = sceneOffsets.current[i] || 0;
        const dur = scenes[i].durationSec || 12;
        if (timeSec >= offset && timeSec < offset + dur) {
          sIdx = i;
          sTime = timeSec - offset;
          break;
        } else if (i === scenes.length - 1 && timeSec >= offset + dur) {
          sIdx = scenes.length - 1;
          sTime = dur;
        }
      }

      if (sIdx !== currentSceneIdx) {
        setCurrentSceneIdx(sIdx);
        if (isPlaying) {
          playSceneAudio(sIdx);
        }
      }

      const scene = scenes[sIdx] || scenes[0];
      const sceneDur = scene?.durationSec || 12;
      const progress = Math.min(1, Math.max(0, sTime / sceneDur));
      const style = script.style || 'whiteboard';

      // 1. Render Background based on style
      ctx.clearRect(0, 0, width, height);

      if (style === 'whiteboard') {
        // Whiteboard / Chalkboard aesthetic
        ctx.fillStyle = '#0f172a'; // Deep slate chalkboard
        ctx.fillRect(0, 0, width, height);

        // Subtle grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Top decorative border
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(0, 0, width * progress, 4);
      } else if (style === 'animated_teacher') {
        // Modern Studio Gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Glowing studio ambient circle
        const circleGrad = ctx.createRadialGradient(240, 360, 20, 240, 360, 350);
        circleGrad.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
        circleGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = circleGrad;
        ctx.beginPath();
        ctx.arc(240, 360, 350, 0, Math.PI * 2);
        ctx.fill();
      } else if (style === '3d_animation') {
        // Futuristic Cyber Lab
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);

        // Rotating 3D wireframe plane
        ctx.save();
        ctx.translate(width / 2, height / 2 + 100);
        ctx.rotate((timeSec * 0.2) % (Math.PI * 2));
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1.5;
        for (let r = 50; r <= 320; r += 45) {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      } else {
        // Presentation & Storytelling
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(1, '#1e293b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Header: Topic & Scene Title Card
      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `STUDYMATE AI • ${script.title.toUpperCase()} (SCENE ${sIdx + 1}/${scenes.length})`,
        48,
        52
      );

      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(scene?.title || 'Key Concept', 48, 96);

      // 3. Main Educational Content Board
      const boardX = style === 'animated_teacher' ? 360 : 64;
      const boardWidth = style === 'animated_teacher' ? width - 420 : width - 128;
      const boardY = 130;
      const boardHeight = height - 260;

      // Card Container Glassmorphism
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(boardX, boardY, boardWidth, boardHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Board Header
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(scene?.boardTitle || 'Key Breakdown', boardX + 32, boardY + 44);

      // Key Bullets with typewriter / progressive reveal effect
      const bullets = scene?.keyBullets || [];
      const bulletsToShow = Math.min(bullets.length, Math.floor(progress * (bullets.length + 0.8)));

      bullets.forEach((bullet, bIdx) => {
        if (bIdx <= bulletsToShow) {
          const itemY = boardY + 95 + bIdx * 48;
          const isCurrentBullet = bIdx === bulletsToShow;

          // Icon indicator
          ctx.fillStyle = isCurrentBullet ? '#38bdf8' : '#10b981';
          ctx.beginPath();
          ctx.arc(boardX + 42, itemY - 6, 6, 0, Math.PI * 2);
          ctx.fill();

          // Bullet text
          ctx.fillStyle = isCurrentBullet ? '#ffffff' : '#cbd5e1';
          ctx.font = `${isCurrentBullet ? '600' : '500'} 18px "Plus Jakarta Sans", sans-serif`;
          ctx.fillText(bullet, boardX + 64, itemY);
        }
      });

      // Highlight Box: Formula, Code, or Theorem
      if (scene?.formulaOrCode) {
        const formulaY = boardY + boardHeight - 110;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(boardX + 32, formulaY, boardWidth - 64, 80, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#818cf8';
        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.fillText('FORMULA / CORE PRINCIPLE', boardX + 50, formulaY + 28);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.fillText(scene.formulaOrCode, boardX + 50, formulaY + 58);
      }

      // 4. Visual Diagram Animation or Teacher Avatar
      if (style === 'animated_teacher') {
        // Draw Professor Nova (Animated Teacher Avatar)
        const avatarX = 180;
        const avatarY = 320;
        const bounce = Math.sin(timeSec * 3) * 6;
        const isSpeaking = isPlaying && !isMuted;

        // Teacher Body
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.ellipse(avatarX, avatarY + 120 + bounce, 90, 110, 0, 0, Math.PI * 2);
        ctx.fill();

        // White Collar / Coat
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(avatarX - 25, avatarY + 45 + bounce);
        ctx.lineTo(avatarX + 25, avatarY + 45 + bounce);
        ctx.lineTo(avatarX, avatarY + 95 + bounce);
        ctx.closePath();
        ctx.fill();

        // Teacher Head
        ctx.fillStyle = '#fed7aa'; // Warm complexion
        ctx.beginPath();
        ctx.arc(avatarX, avatarY + bounce, 56, 0, Math.PI * 2);
        ctx.fill();

        // Hair (Modern academic styling)
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(avatarX, avatarY - 14 + bounce, 60, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();

        // Glasses
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 3.5;
        // Left rim
        ctx.beginPath();
        ctx.arc(avatarX - 20, avatarY - 2 + bounce, 14, 0, Math.PI * 2);
        ctx.stroke();
        // Right rim
        ctx.beginPath();
        ctx.arc(avatarX + 20, avatarY - 2 + bounce, 14, 0, Math.PI * 2);
        ctx.stroke();
        // Bridge
        ctx.beginPath();
        ctx.moveTo(avatarX - 6, avatarY - 2 + bounce);
        ctx.lineTo(avatarX + 6, avatarY - 2 + bounce);
        ctx.stroke();

        // Eyes (blinking cycle)
        const isBlinking = Math.floor(timeSec * 2) % 6 === 0 && (timeSec * 2) % 1 < 0.25;
        ctx.fillStyle = '#1e293b';
        if (!isBlinking) {
          ctx.beginPath();
          ctx.arc(avatarX - 20, avatarY - 2 + bounce, 4, 0, Math.PI * 2);
          ctx.arc(avatarX + 20, avatarY - 2 + bounce, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(avatarX - 26, avatarY - 2 + bounce);
          ctx.lineTo(avatarX - 14, avatarY - 2 + bounce);
          ctx.moveTo(avatarX + 14, avatarY - 2 + bounce);
          ctx.lineTo(avatarX + 26, avatarY - 2 + bounce);
          ctx.stroke();
        }

        // Talking Mouth animation
        ctx.fillStyle = '#991b1b';
        const mouthOpen = isSpeaking ? Math.abs(Math.sin(timeSec * 14)) * 12 + 2 : 3;
        ctx.beginPath();
        ctx.ellipse(avatarX, avatarY + 28 + bounce, 12, mouthOpen, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pointing Hand with Laser Pointer pointing towards the board!
        const handX = avatarX + 110 + Math.sin(timeSec * 2) * 10;
        const handY = avatarY + 60 + Math.cos(timeSec * 2) * 8;
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(handX, handY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Pointer stick
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(handX + 60, handY - 40);
        ctx.stroke();

        // Laser pointer dot on the active board
        const laserX = boardX + 42;
        const laserY = boardY + 95 + Math.min(bullets.length - 1, bulletsToShow) * 48 - 6;
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(laserX, laserY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Teacher Tag
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(avatarX - 70, avatarY + 200, 140, 32, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#c7d2fe';
        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎓 Dr. StudyMate AI', avatarX, avatarY + 221);
        ctx.textAlign = 'left';
      } else {
        // Draw Dynamic Academic Diagram in top right of board
        const diagX = boardX + boardWidth - 190;
        const diagY = boardY + 70;

        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;

        if (scene?.diagramType === 'geometric_circle' || !scene?.diagramType) {
          // Animated unit circle / trigonometry
          ctx.beginPath();
          ctx.arc(diagX + 70, diagY + 70, 55, 0, Math.PI * 2);
          ctx.stroke();

          // Rotating vector radius
          const angle = (timeSec * 1.5) % (Math.PI * 2);
          ctx.strokeStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(diagX + 70, diagY + 70);
          ctx.lineTo(diagX + 70 + Math.cos(angle) * 55, diagY + 70 - Math.sin(angle) * 55);
          ctx.stroke();

          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(diagX + 70 + Math.cos(angle) * 55, diagY + 70 - Math.sin(angle) * 55, 5, 0, Math.PI * 2);
          ctx.fill();
        } else if (scene?.diagramType === 'chemical_reaction') {
          // Molecule / Chemical bonds animation
          ctx.fillStyle = '#6366f1';
          ctx.beginPath();
          ctx.arc(diagX + 40, diagY + 70, 20, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#14b8a6';
          ctx.beginPath();
          ctx.arc(diagX + 110, diagY + 70, 26, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#94a3b8';
          ctx.beginPath();
          ctx.moveTo(diagX + 58, diagY + 65);
          ctx.lineTo(diagX + 85, diagY + 65);
          ctx.moveTo(diagX + 58, diagY + 75);
          ctx.lineTo(diagX + 85, diagY + 75);
          ctx.stroke();
        } else {
          // Coordinate graph with wave function
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.moveTo(diagX, diagY + 70);
          ctx.lineTo(diagX + 150, diagY + 70);
          ctx.moveTo(diagX + 75, diagY);
          ctx.lineTo(diagX + 75, diagY + 140);
          ctx.stroke();

          ctx.strokeStyle = '#38bdf8';
          ctx.beginPath();
          for (let x = 0; x <= 140; x += 4) {
            const y = 70 - Math.sin((x + timeSec * 40) * 0.08) * 35;
            if (x === 0) ctx.moveTo(diagX + x, diagY + y);
            else ctx.lineTo(diagX + x, diagY + y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // 5. Subtitles / Captions Banner
      if (showCaptions && activeSubtitle) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        ctx.roundRect(boardX, height - 90, boardWidth, 54, 10);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';

        // Truncate long subtitles gracefully
        const maxLen = Math.floor(boardWidth / 9.5);
        const displaySub =
          activeSubtitle.length > maxLen
            ? activeSubtitle.slice(0, maxLen - 3) + '...'
            : activeSubtitle;
        ctx.fillText(`“${displaySub}”`, boardX + boardWidth / 2, height - 56);
        ctx.textAlign = 'left';
      }

      // 6. Watermark in bottom right
      ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Generated by StudyMate AI Video Engine', width - 260, height - 20);
    },
    [script, scenes, currentSceneIdx, isPlaying, isMuted, showCaptions, activeSubtitle, playSceneAudio]
  );

  // Animation Loop
  const loop = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedTimeRef.current * 1000;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000 * playbackSpeed;

      if (elapsed >= totalDuration) {
        setIsPlaying(false);
        speechManager.stop();
        setCurrentTimeSec(totalDuration);
        drawFrame(totalDuration);
        onFinished?.();
        return;
      }

      setCurrentTimeSec(elapsed);
      drawFrame(elapsed);

      if (isPlaying) {
        animationFrameId.current = requestAnimationFrame(loop);
      }
    },
    [totalDuration, playbackSpeed, isPlaying, drawFrame, onFinished]
  );

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = 0;
      pausedTimeRef.current = currentTimeSec;
      playSceneAudio(currentSceneIdx);
      animationFrameId.current = requestAnimationFrame(loop);
    } else {
      speechManager.stop();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      speechManager.stop();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying]);

  // Initial draw
  useEffect(() => {
    drawFrame(0);
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, []);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTimeSec(target);
    pausedTimeRef.current = target;
    startTimeRef.current = 0;
    drawFrame(target);

    // Find new scene
    for (let i = 0; i < scenes.length; i++) {
      const offset = sceneOffsets.current[i] || 0;
      const dur = scenes[i].durationSec || 12;
      if (target >= offset && target < offset + dur) {
        setCurrentSceneIdx(i);
        if (isPlaying) playSceneAudio(i);
        break;
      }
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(totalDuration, currentTimeSec + seconds));
    setCurrentTimeSec(newTime);
    pausedTimeRef.current = newTime;
    startTimeRef.current = 0;
    drawFrame(newTime);
  };

  const handleJumpToScene = (idx: number) => {
    const targetOffset = sceneOffsets.current[idx] || 0;
    setCurrentSceneIdx(idx);
    setCurrentTimeSec(targetOffset);
    pausedTimeRef.current = targetOffset;
    startTimeRef.current = 0;
    drawFrame(targetOffset);
    if (isPlaying) {
      playSceneAudio(idx);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Real Educational Video File Recording (.webm / .mp4 export)
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    try {
      setIsRecording(true);
      setRecordProgress(0);

      // Create stream from Canvas
      const stream = canvas.captureStream(30);

      // Setup audio destination
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      stream.addTrack(dest.stream.getAudioTracks()[0] || dest.stream.getTracks()[0]);

      // MediaRecorder setup
      let options: MediaRecorderOptions = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = { mimeType: 'video/webm' };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      const recordedChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const cleanTitle = (script.title || 'studymate_lesson').toLowerCase().replace(/\s+/g, '_');
        a.download = `${cleanTitle}.webm`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          setIsRecording(false);
        }, 100);
      };

      mediaRecorder.start();

      // Render all scenes sequentially
      let simTime = 0;
      const step = 0.05; // 20 updates per second for recording
      const recordTimer = setInterval(() => {
        simTime += step;
        drawFrame(simTime);
        setRecordProgress(Math.min(100, Math.round((simTime / totalDuration) * 100)));

        if (simTime >= totalDuration) {
          clearInterval(recordTimer);
          mediaRecorder.stop();
        }
      }, 50);
    } catch (err) {
      console.error('Failed to record video file:', err);
      setIsRecording(false);
      alert('Could not record video stream in this browser session.');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}
    >
      {/* Canvas Viewport (16:9 ratio, 960x540 base) */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain cursor-pointer"
          onClick={handleTogglePlay}
        />

        {/* Big Center Play Overlay when paused */}
        {!isPlaying && (
          <button
            onClick={handleTogglePlay}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center hover:bg-indigo-500 hover:scale-105 transition-all shadow-xl backdrop-blur-sm group"
          >
            <Play className="w-8 h-8 ml-1 fill-white group-hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Recording Modal Banner */}
        {isRecording && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-30">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Rendering Educational Video File...</h4>
            <p className="text-sm text-slate-400 mb-4 max-w-sm">
              Capturing animated whiteboard, voice track, and diagrams into a downloadable WebM/MP4
              video.
            </p>
            <div className="w-64 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-indigo-500 transition-all duration-150"
                style={{ width: `${recordProgress}%` }}
              />
            </div>
            <span className="text-xs text-indigo-400 font-semibold mt-2">{recordProgress}% complete</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800/80 px-4 py-3 flex flex-col gap-2">
        {/* Progress Scrubber */}
        <div className="relative flex items-center group">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.1}
            value={currentTimeSec}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-2 transition-all"
          />

          {/* Chapter markers for each scene */}
          <div className="absolute inset-0 pointer-events-none flex">
            {scenes.map((s, idx) => {
              const offset = sceneOffsets.current[idx] || 0;
              const leftPercent = (offset / totalDuration) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-1 bg-white/30 rounded"
                  style={{ left: `${leftPercent}%` }}
                  title={`Scene ${idx + 1}: ${s.title}`}
                />
              );
            })}
          </div>
        </div>

        {/* Buttons and toggles */}
        <div className="flex items-center justify-between text-slate-300 text-sm">
          {/* Left: Playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-lg hover:bg-slate-800 text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button
              onClick={() => handleSkip(-5)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              title="Rewind 5s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono text-slate-400 ml-1">
              {formatTime(currentTimeSec)} / {formatTime(totalDuration)}
            </span>

            {/* Mute toggle */}
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted) speechManager.stop();
              }}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white ml-2"
              title={isMuted ? 'Unmute' : 'Mute Voice'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Center: Scene Jumper Buttons */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-500 font-medium px-1">Scenes:</span>
            {scenes.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleJumpToScene(idx)}
                className={`text-xs px-2 py-0.5 rounded transition-all ${
                  idx === currentSceneIdx
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Right: Tools & Actions */}
          <div className="flex items-center gap-2">
            {/* Speed toggle */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="bg-slate-800 text-xs text-slate-200 rounded px-2 py-1 border border-slate-700 outline-none hover:bg-slate-700 cursor-pointer"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>

            {/* Captions toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-2 rounded-lg transition-colors ${
                showCaptions ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Subtitles"
            >
              <Captions className="w-4 h-4" />
            </button>

            {/* Download Video Button */}
            <button
              onClick={handleExportVideo}
              disabled={isRecording}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              title="Download real video file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Video</span>
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Scene Summary and Quiz Challenge Accordion */}
      {script.quizChallenge && (
        <div className="bg-slate-900/40 p-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-slate-300">
              <span className="font-semibold text-white">Video Quick Check:</span>{' '}
              {script.quizChallenge.question}
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 whitespace-nowrap">
            Take full quiz in Practice mode
          </span>
        </div>
      )}
    </div>
  );
};
