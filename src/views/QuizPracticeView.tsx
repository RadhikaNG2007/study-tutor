import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  BookOpen,
  Layers,
  ArrowRight,
  Award,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { QuizQuestion, Flashcard, Subject } from '../types';
import { apiService } from '../services/api';

interface QuizPracticeViewProps {
  onQuizCompleted: (score: number, total: number) => void;
}

export const QuizPracticeView: React.FC<QuizPracticeViewProps> = ({ onQuizCompleted }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'flashcards'>('quiz');
  const [topic, setTopic] = useState<string>('Calculus & Limits');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q1',
      question: 'What is the limit of (sin x) / x as x approaches 0?',
      options: ['0', '1', 'Undefined', 'Infinity'],
      correctAnswerIndex: 1,
      explanation:
        'Using the Squeeze Theorem or L’Hôpital’s Rule (differentiating numerator to cos x and denominator to 1), cos(0)/1 = 1.',
      hint: 'Recall the classic fundamental trigonometric limit or apply L’Hôpital’s rule.',
    },
    {
      id: 'q2',
      question: 'What does the derivative dy/dx represent geometrically on a function graph?',
      options: [
        'The area under the curve',
        'The slope of the tangent line at that point',
        'The distance from the origin',
        'The maximum value of the function',
      ],
      correctAnswerIndex: 1,
      explanation:
        'The derivative measures instantaneous rate of change, which is geometrically represented by the tangent line slope.',
      hint: 'Think about a tangent touching a single point on a curve.',
    },
  ]);

  const [activeHints, setActiveHints] = useState<{ [key: string]: boolean }>({});
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: 'fc1',
      front: 'Newton’s Second Law of Motion',
      back: 'Force equals mass multiplied by acceleration (F = m × a). A net external force causes an object to accelerate in that direction.',
      subject: 'Physics',
      mastered: true,
    },
    {
      id: 'fc2',
      front: 'Mitochondria function in eukaryotic cells',
      back: 'The "powerhouse" of the cell; produces ATP (adenosine triphosphate) through cellular respiration and the Krebs cycle.',
      subject: 'Biology',
      mastered: false,
    },
    {
      id: 'fc3',
      front: 'Time Complexity of Binary Search',
      back: 'O(log n) because the search space is divided in half on each step. Requires a sorted array.',
      subject: 'Computer Science',
      mastered: false,
    },
  ]);

  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;

    try {
      setIsGenerating(true);
      setShowSummary(false);
      setUserAnswers({});
      setActiveHints({});

      const generated = await apiService.generateQuiz(topic, 'General', 4, difficulty);
      if (generated && generated.length > 0) {
        setQuestions(generated);
      }
    } catch (err: any) {
      console.error(err);
      alert('Could not generate quiz: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (qId: string, optionIdx: number) => {
    if (userAnswers[qId] !== undefined) return; // already answered
    const nextAnswers = { ...userAnswers, [qId]: optionIdx };
    setUserAnswers(nextAnswers);

    // If all answered, show summary
    if (Object.keys(nextAnswers).length === questions.length) {
      let score = 0;
      questions.forEach((q) => {
        if (nextAnswers[q.id] === q.correctAnswerIndex) score++;
      });
      onQuizCompleted(score, questions.length);
      setShowSummary(true);
    }
  };

  const toggleHint = (qId: string) => {
    setActiveHints((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleMarkMastered = (cardId: string) => {
    setFlashcards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, mastered: !c.mastered } : c))
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
            <span>Interactive Assessment & Knowledge Check</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Quizzes & Practice Arena
          </h2>
          <p className="text-slate-400 text-sm">
            Generate customized MCQ assessments, inspect instant step-by-step explanations, or study
            with interactive flip flashcards.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            MCQ Quizzes
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flashcards Deck
          </button>
        </div>
      </div>

      {activeTab === 'quiz' ? (
        /* QUIZ MODE */
        <div className="space-y-6">
          {/* Quiz Generator Bar */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic for practice quiz (e.g. 'Photosynthesis', 'Organic Chemistry', 'World War II')"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 outline-none focus:border-cyan-400"
              >
                <option value="easy">Easy (Fundamentals)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="hard">Hard (Advanced / Exam)</option>
              </select>

              <button
                onClick={handleGenerateQuiz}
                disabled={!topic.trim() || isGenerating}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-40 whitespace-nowrap transition-all"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Score Banner if completed */}
          {showSummary && (
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">Quiz Completed!</h4>
                  <p className="text-xs text-emerald-300">
                    You scored{' '}
                    {questions.filter((q) => userAnswers[q.id] === q.correctAnswerIndex).length} out
                    of {questions.length} correct. Review explanations below!
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateQuiz}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Try Another Set
              </button>
            </div>
          )}

          {/* Question Cards */}
          <div className="space-y-4">
            {questions.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                        Question {qIndex + 1}
                      </span>
                      <h4 className="text-base font-bold text-white">{q.question}</h4>
                    </div>

                    {/* Hint trigger */}
                    {q.hint && (
                      <button
                        onClick={() => toggleHint(q.id)}
                        className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center gap-1 transition-colors flex-shrink-0"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{activeHints[q.id] ? 'Hide Hint' : 'Get Hint'}</span>
                      </button>
                    )}
                  </div>

                  {/* Hint Reveal */}
                  {activeHints[q.id] && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                      💡 <strong>Hint:</strong> {q.hint}
                    </div>
                  )}

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.options.map((opt, optIndex) => {
                      let btnStyle =
                        'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';

                      if (isAnswered) {
                        if (optIndex === q.correctAnswerIndex) {
                          btnStyle =
                            'bg-emerald-950/80 border-emerald-500 text-white font-semibold ring-1 ring-emerald-500';
                        } else if (optIndex === selectedOpt) {
                          btnStyle = 'bg-red-950/80 border-red-500 text-white font-semibold';
                        } else {
                          btnStyle = 'bg-slate-950/50 border-slate-850 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectAnswer(q.id, optIndex)}
                          disabled={isAnswered}
                          className={`p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIndex === q.correctAnswerIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                          {isAnswered &&
                            optIndex === selectedOpt &&
                            optIndex !== q.correctAnswerIndex && (
                              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
                            )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Explanation when answered */}
                  {isAnswered && (
                    <div
                      className={`p-4 rounded-xl border text-xs space-y-1 ${
                        isCorrect
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200'
                      }`}
                    >
                      <div className="font-bold">
                        {isCorrect ? '✅ Correct Answer!' : '❌ Explanation & Lesson:'}
                      </div>
                      <p className="leading-relaxed text-slate-300">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* FLASHCARDS STUDY DECK */
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Card {currentCardIdx + 1} of {flashcards.length}
            </span>
            <span className="font-semibold text-emerald-400">
              {flashcards.filter((f) => f.mastered).length} Mastered
            </span>
          </div>

          {/* 3D Flip Card */}
          {flashcards.length > 0 && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[300px] w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between cursor-pointer hover:border-indigo-500/50 transition-all shadow-xl select-none group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {flashcards[currentCardIdx].subject}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">
                  Click to Flip 🔄
                </span>
              </div>

              <div className="py-8 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {isFlipped
                    ? flashcards[currentCardIdx].back
                    : flashcards[currentCardIdx].front}
                </h3>
                <p className="text-xs text-slate-400">
                  {isFlipped ? '(Explanation / Definition)' : '(Concept / Question)'}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">
                  {flashcards[currentCardIdx].mastered ? '⭐ Mastered' : '⏳ Needs Practice'}
                </span>
                <span className="text-cyan-400 font-semibold group-hover:underline">
                  {isFlipped ? 'Show Front' : 'Show Answer'}
                </span>
              </div>
            </div>
          )}

          {/* Card Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIdx((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold border border-slate-800"
            >
              Previous
            </button>

            <button
              onClick={() => handleMarkMastered(flashcards[currentCardIdx].id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                flashcards[currentCardIdx]?.mastered
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
              }`}
            >
              {flashcards[currentCardIdx]?.mastered ? 'Mark for Review' : 'Mark as Mastered'}
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIdx((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-semibold border border-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
