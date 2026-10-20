import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { HomeView } from './views/HomeView';
import { ChatView } from './views/ChatView';
import { VisionAnalyzerView } from './views/VisionAnalyzerView';
import { VideoGeneratorView } from './views/VideoGeneratorView';
import { VideoLibraryView } from './views/VideoLibraryView';
import { CodingTutorView } from './views/CodingTutorView';
import { QuizPracticeView } from './views/QuizPracticeView';
import { ProgressView } from './views/ProgressView';
import { SettingsView } from './views/SettingsView';
import {
  ChatMessage,
  Subject,
  SavedVideo,
  UserStats,
  ImageAnalysisResult,
  VideoScript,
} from './types';
import { apiService } from './services/api';
import { Menu, X, Sparkles } from 'lucide-react';

const INITIAL_SAVED_VIDEOS: SavedVideo[] = [
  {
    id: 'sample_pythagoras',
    title: 'The Pythagorean Theorem: Visual Geometric Proof',
    topic: 'Pythagorean Theorem: a² + b² = c²',
    subject: 'Mathematics',
    style: 'whiteboard',
    durationSec: 48,
    createdAt: 'Today',
    viewsCount: 3,
    script: {
      title: 'Pythagorean Theorem: Visual Proof',
      overview:
        'A visual and intuitive proof showing why the sum of the squares on the legs of a right triangle equals the square on the hypotenuse.',
      style: 'whiteboard',
      totalDurationSec: 48,
      scenes: [
        {
          sceneNumber: 1,
          title: 'The Core Right Triangle',
          durationSec: 12,
          narration:
            'Welcome! Today we are exploring the Pythagorean theorem. In any right-angled triangle, the sides a and b connect at ninety degrees, opposing the hypotenuse c.',
          visualStyle: 'whiteboard',
          boardTitle: '1. The Right Triangle Fundamentals',
          keyBullets: [
            'Side a and Side b are perpendicular legs',
            'Side c is the longest side, opposing the 90° angle',
            'Applies to Euclidean geometry everywhere',
          ],
          formulaOrCode: 'a² + b² = c²',
          diagramType: 'geometric_circle',
        },
        {
          sceneNumber: 2,
          title: 'Visual Proof by Squares',
          durationSec: 16,
          narration:
            'Imagine building an actual square off each side. The geometric area of square a plus square b matches the total area of square c exactly!',
          visualStyle: 'whiteboard',
          boardTitle: '2. Geometric Area Equality',
          keyBullets: [
            'Area of Square on leg a = a²',
            'Area of Square on leg b = b²',
            'Total combined area seamlessly fills square c²',
          ],
          formulaOrCode: 'Area(A) + Area(B) = Area(C)',
          diagramType: 'coordinate_wave',
        },
        {
          sceneNumber: 3,
          title: 'Real World Applications',
          durationSec: 20,
          narration:
            'From GPS navigation and architecture to screen resolution diagonals, this timeless formula lets engineers calculate straight-line distances instantly.',
          visualStyle: 'whiteboard',
          boardTitle: '3. Real-World Applications',
          keyBullets: [
            'GPS triangulation & distance vectors',
            'Computer graphics raytracing & rendering',
            'Civil architecture & structural roofing',
          ],
          formulaOrCode: 'Distance = √(Δx² + Δy²)',
          diagramType: 'geometric_circle',
        },
      ],
      summaryKeyPoints: [
        'Only applies to right-angled triangles.',
        'a² + b² = c².',
        'Hypotenuse is always the longest side.',
      ],
      quizChallenge: {
        question: 'If a triangle has legs of length 3 and 4, what is the length of the hypotenuse?',
        options: ['5', '6', '7', '8'],
        correctIndex: 0,
        explanation: '3² + 4² = 9 + 16 = 25. The square root of 25 is 5.',
      },
    },
  },
  {
    id: 'sample_photosynthesis',
    title: 'How Photosynthesis Converts Light into Energy',
    topic: 'Photosynthesis & Chloroplast Function',
    subject: 'Biology',
    style: 'animated_teacher',
    durationSec: 54,
    createdAt: 'Yesterday',
    viewsCount: 5,
    script: {
      title: 'Photosynthesis: Energy from Light',
      overview:
        'Step-by-step breakdown of how plant chloroplasts convert sunlight, water, and carbon dioxide into glucose and breathable oxygen.',
      style: 'animated_teacher',
      totalDurationSec: 54,
      scenes: [
        {
          sceneNumber: 1,
          title: 'The Chloroplast Engine',
          durationSec: 14,
          narration:
            'Hello students! I am Dr. StudyMate. Plant leaves are essentially microscopic solar power plants! Inside their cells, chloroplast organelles capture photons from the sun.',
          visualStyle: 'animated_teacher',
          boardTitle: '1. Solar Capture Organelle',
          keyBullets: [
            'Chloroplasts contain green chlorophyll pigments',
            'Sunlight photons excite electrons in thylakoid membranes',
            'Water molecules (H2O) are split, releasing pure O2',
          ],
          formulaOrCode: '6CO2 + 6H2O + Light → C6H12O6 + 6O2',
          diagramType: 'chemical_reaction',
          teacherMood: 'welcoming',
        },
        {
          sceneNumber: 2,
          title: 'Light-Dependent Reactions vs Calvin Cycle',
          durationSec: 20,
          narration:
            'Photosynthesis happens in two stages: first the Light Reactions make ATP chemical batteries, and then the Calvin Cycle in the stroma builds organic glucose sugars.',
          visualStyle: 'animated_teacher',
          boardTitle: '2. The Two Biochemical Phases',
          keyBullets: [
            'Light Reactions: Produces ATP & NADPH, exhausts Oxygen',
            'Calvin Cycle (Dark): Fixes carbon dioxide into Glucose',
            'Glucose fuels plant growth and produces the food web base',
          ],
          formulaOrCode: 'ATP + NADPH + CO2 → Glucose (C6H12O6)',
          diagramType: 'chemical_reaction',
          teacherMood: 'explaining',
        },
        {
          sceneNumber: 3,
          title: 'Earth Ecology Takeaway',
          durationSec: 20,
          narration:
            'Without this single biochemical reaction, Earth would have no atmospheric oxygen and no complex food web. Always remember: plants sustain our entire biosphere!',
          visualStyle: 'animated_teacher',
          boardTitle: '3. Global Biosphere Impact',
          keyBullets: [
            'Generates atmospheric oxygen (O2)',
            'Regulates planetary carbon levels',
            'Primary biomass foundation of life on Earth',
          ],
          formulaOrCode: 'Photosynthetic Efficiency ≈ 3-6%',
          diagramType: 'coordinate_wave',
          teacherMood: 'celebrating',
        },
      ],
      summaryKeyPoints: [
        'Inputs: Sunlight, Water, Carbon Dioxide.',
        'Outputs: Glucose and Oxygen.',
        'Occurs inside the plant cell chloroplasts.',
      ],
      quizChallenge: {
        question: 'What gas is released as a byproduct when water is split during light reactions?',
        options: ['Oxygen (O2)', 'Carbon Dioxide (CO2)', 'Nitrogen (N2)', 'Methane (CH4)'],
        correctIndex: 0,
        explanation: 'Water photolysis splits H2O into protons, electrons, and O2 gas.',
      },
    },
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('General');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // User Settings
  const [gradeLevel, setGradeLevel] = useState<string>('High School');
  const [preferredVoice, setPreferredVoice] = useState<string>('Kore');

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('studymate_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Video Library State
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>(() => {
    const saved = localStorage.getItem('studymate_videos');
    return saved ? JSON.parse(saved) : INITIAL_SAVED_VIDEOS;
  });

  // User Learning Progress Stats
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('studymate_stats');
    return saved
      ? JSON.parse(saved)
      : {
          streakDays: 7,
          studyMinutes: 185,
          questionsAsked: 14,
          videosGenerated: 3,
          quizzesCompleted: 6,
          quizAccuracy: 88,
          flashcardsMastered: 12,
        };
  });

  // Preload data for Video Generator when triggered from OCR or Chat
  const [videoPreload, setVideoPreload] = useState<{
    topic: string;
    context: string;
    image?: string;
  } | null>(null);

  // Check health on mount
  useEffect(() => {
    apiService.checkHealth().then((res) => {
      setHasApiKey(res.hasApiKey);
    });
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('studymate_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('studymate_videos', JSON.stringify(savedVideos));
  }, [savedVideos]);

  useEffect(() => {
    localStorage.setItem('studymate_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Chat handler
  const handleSendMessage = async (content: string, mode?: string) => {
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString(),
      subject: selectedSubject,
      mode,
    };

    const newThread = [...chatMessages, userMsg];
    setChatMessages(newThread);
    setIsChatLoading(true);

    // Update stats
    setUserStats((prev) => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1,
      studyMinutes: prev.studyMinutes + 3,
    }));

    try {
      const reply = await apiService.sendChat(
        newThread.map((m) => ({ role: m.role, content: m.content })),
        { subject: selectedSubject, mode, level: gradeLevel }
      );

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString(),
        subject: selectedSubject,
        mode,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleQuickAsk = (prompt: string, subject?: Subject) => {
    if (subject) setSelectedSubject(subject);
    setCurrentTab('chat');
    handleSendMessage(prompt);
  };

  const handleStartVideoTopic = (topic: string) => {
    setVideoPreload({ topic, context: '' });
    setCurrentTab('video-generator');
  };

  const handleTurnIntoVideo = (topic: string, context: string, imageBase64?: string) => {
    setVideoPreload({ topic, context, image: imageBase64 });
    setCurrentTab('video-generator');
  };

  const handleSaveVideo = (video: SavedVideo) => {
    setSavedVideos((prev) => [video, ...prev]);
    setUserStats((prev) => ({
      ...prev,
      videosGenerated: prev.videosGenerated + 1,
      studyMinutes: prev.studyMinutes + 10,
    }));
  };

  const handleDeleteVideo = (id: string) => {
    setSavedVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleQuizCompleted = (score: number, total: number) => {
    setUserStats((prev) => {
      const accuracy = Math.round((score / total) * 100);
      const newAcc = Math.round((prev.quizAccuracy + accuracy) / 2);
      return {
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        quizAccuracy: newAcc,
        studyMinutes: prev.studyMinutes + 8,
      };
    });
  };

  const handleResetAllData = () => {
    localStorage.clear();
    setChatMessages([]);
    setSavedVideos(INITIAL_SAVED_VIDEOS);
    setUserStats({
      streakDays: 1,
      studyMinutes: 0,
      questionsAsked: 0,
      videosGenerated: 0,
      quizzesCompleted: 0,
      quizAccuracy: 100,
      flashcardsMastered: 0,
    });
    alert('All study progress, video scripts, and chats have been reset.');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 antialiased overflow-hidden">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:static lg:block transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setMobileMenuOpen(false);
          }}
          streakDays={userStats.streakDays}
          selectedSubject={selectedSubject}
          onSelectSubject={(sub) => setSelectedSubject(sub)}
          hasApiKey={hasApiKey}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-extrabold text-sm text-white">
              StudyMate <span className="text-cyan-400">AI</span>
            </span>
          </div>
          <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            🔥 {userStats.streakDays}d
          </span>
        </div>

        {/* View Router */}
        {currentTab === 'home' && (
          <HomeView
            onNavigate={(tab) => setCurrentTab(tab)}
            onQuickAsk={handleQuickAsk}
            onStartVideoTopic={handleStartVideoTopic}
            savedVideos={savedVideos}
            streakDays={userStats.streakDays}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            onTurnIntoVideo={(topic, context) => handleTurnIntoVideo(topic, context)}
            onClearChat={() => setChatMessages([])}
          />
        )}

        {currentTab === 'vision' && (
          <VisionAnalyzerView
            onTeachMePage={(analysis) => {
              handleQuickAsk(
                `Teach me everything about this page on ${analysis.topic}. Here is the extracted text: ${analysis.extractedText}`
              );
            }}
            onMakeVideoFromPage={(topic, context, image) =>
              handleTurnIntoVideo(topic, context, image)
            }
          />
        )}

        {currentTab === 'video-generator' && (
          <VideoGeneratorView
            initialTopic={videoPreload?.topic}
            initialContext={videoPreload?.context}
            initialImage={videoPreload?.image}
            onSaveToLibrary={handleSaveVideo}
            onNavigateToLibrary={() => setCurrentTab('video-library')}
          />
        )}

        {currentTab === 'video-library' && (
          <VideoLibraryView
            savedVideos={savedVideos}
            onDeleteVideo={handleDeleteVideo}
            onNavigateToGenerator={() => setCurrentTab('video-generator')}
          />
        )}

        {currentTab === 'coding' && <CodingTutorView />}

        {currentTab === 'quiz' && (
          <QuizPracticeView onQuizCompleted={handleQuizCompleted} />
        )}

        {currentTab === 'progress' && <ProgressView stats={userStats} />}

        {currentTab === 'settings' && (
          <SettingsView
            hasApiKey={hasApiKey}
            gradeLevel={gradeLevel}
            onSetGradeLevel={setGradeLevel}
            preferredVoice={preferredVoice}
            onSetPreferredVoice={setPreferredVoice}
            onResetAllData={handleResetAllData}
          />
        )}
      </main>
    </div>
  );
}
