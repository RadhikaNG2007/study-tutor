import React, { useState, useRef } from 'react';
import {
  Upload,
  FileScan,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Video,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Send,
  Cpu,
} from 'lucide-react';
import { ImageAnalysisResult } from '../types';
import { apiService } from '../services/api';

interface VisionAnalyzerViewProps {
  onTeachMePage: (analysis: ImageAnalysisResult) => void;
  onMakeVideoFromPage: (topic: string, context: string, imageBase64?: string) => void;
}

export const VisionAnalyzerView: React.FC<VisionAnalyzerViewProps> = ({
  onTeachMePage,
  onMakeVideoFromPage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample pre-loaded academic textbook pages & diagrams for quick testing
  const sampleAcademicImages = [
    {
      title: 'Calculus: Derivatives & Tangents',
      subject: 'Mathematics',
      description: 'Geometric interpretation of derivative dy/dx on a curve',
      sampleSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="#0f172a">
        <rect width="600" height="400" fill="#0f172a"/>
        <line x1="60" y1="340" x2="540" y2="340" stroke="#475569" stroke-width="2"/>
        <line x1="80" y1="360" x2="80" y2="40" stroke="#475569" stroke-width="2"/>
        <text x="545" y="345" fill="#94a3b8" font-family="sans-serif" font-size="14">x</text>
        <text x="75" y="30" fill="#94a3b8" font-family="sans-serif" font-size="14">y</text>
        <path d="M 100 320 Q 250 300 350 150 T 500 60" fill="none" stroke="#38bdf8" stroke-width="4"/>
        <line x1="200" y1="280" x2="440" y2="80" stroke="#f43f5e" stroke-width="3" stroke-dasharray="6,4"/>
        <circle cx="320" cy="180" r="6" fill="#f43f5e"/>
        <text x="330" y="195" fill="#f8fafc" font-family="sans-serif" font-size="16" font-weight="bold">P(x, f(x))</text>
        <text x="120" y="90" fill="#38bdf8" font-family="sans-serif" font-size="20" font-weight="bold">f'(x) = lim Δx→0 [f(x+Δx) - f(x)] / Δx</text>
        <text x="120" y="125" fill="#e2e8f0" font-family="sans-serif" font-size="14">Slope of Tangent Line at Point P equals the instantaneous rate of change.</text>
      </svg>`,
    },
    {
      title: 'Cellular Biology: Photosynthesis',
      subject: 'Biology',
      description: 'Light reaction & Calvin Cycle in chloroplast organelle',
      sampleSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="#064e3b">
        <rect width="600" height="400" fill="#064e3b"/>
        <ellipse cx="300" cy="200" rx="260" ry="160" fill="#047857" stroke="#10b981" stroke-width="4"/>
        <rect x="90" y="140" width="160" height="120" rx="16" fill="#065f46" stroke="#34d399" stroke-width="2"/>
        <text x="110" y="180" fill="#a7f3d0" font-family="sans-serif" font-size="18" font-weight="bold">Light Reactions</text>
        <text x="110" y="210" fill="#ffffff" font-family="sans-serif" font-size="14">H2O → O2 + ATP</text>
        <circle cx="430" cy="200" r="70" fill="#065f46" stroke="#fbbf24" stroke-width="2"/>
        <text x="380" y="195" fill="#fef08a" font-family="sans-serif" font-size="18" font-weight="bold">Calvin Cycle</text>
        <text x="385" y="225" fill="#ffffff" font-family="sans-serif" font-size="14">CO2 → Glucose</text>
        <text x="100" y="60" fill="#fbbf24" font-family="sans-serif" font-size="22" font-weight="bold">6CO2 + 6H2O + Light → C6H12O6 + 6O2</text>
      </svg>`,
    },
    {
      title: 'Python: QuickSort Partition Logic',
      subject: 'Computer Science',
      description: 'Divide and conquer algorithm implementation and pivot indexing',
      sampleSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="#1e1e2e">
        <rect width="600" height="400" fill="#1e1e2e"/>
        <text x="40" y="50" fill="#89b4fa" font-family="monospace" font-size="16">def quicksort(arr):</text>
        <text x="70" y="80" fill="#cdd6f4" font-family="monospace" font-size="15">    if len(arr) &lt;= 1: return arr</text>
        <text x="70" y="110" fill="#f38ba8" font-family="monospace" font-size="15">    pivot = arr[len(arr) // 2]</text>
        <text x="70" y="140" fill="#a6e3a1" font-family="monospace" font-size="15">    left = [x for x in arr if x &lt; pivot]</text>
        <text x="70" y="170" fill="#f9e2af" font-family="monospace" font-size="15">    middle = [x for x in arr if x == pivot]</text>
        <text x="70" y="200" fill="#94e2d5" font-family="monospace" font-size="15">    right = [x for x in arr if x &gt; pivot]</text>
        <text x="70" y="230" fill="#cdd6f4" font-family="monospace" font-size="15">    return quicksort(left) + middle + quicksort(right)</text>
        <text x="40" y="320" fill="#eba0ac" font-family="sans-serif" font-size="16">Average Time Complexity: O(N log N)</text>
        <text x="40" y="350" fill="#a6adc8" font-family="sans-serif" font-size="14">Worst Case: O(N^2) when pivot is badly skewed</text>
      </svg>`,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysisResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: (typeof sampleAcademicImages)[0]) => {
    // Convert SVG to data URL
    const svgData = `data:image/svg+xml;utf8,${encodeURIComponent(sample.sampleSvg)}`;
    setSelectedImage(svgData);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async (mode: 'general' | 'teach_page' | 'extract_ocr' = 'general') => {
    if (!selectedImage) return;

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);

      const result = await apiService.analyzeImage(
        selectedImage,
        customQuestion.trim() || undefined,
        mode
      );

      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to analyze image. Please ensure API key is active.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <FileScan className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multimodal OCR & Visual Academic Tutor</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Scan Textbook Pages, Diagrams & Notes
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          Upload any academic image: handwritten equations, textbook graphs, circuit diagrams, or
          code. StudyMate AI extracts all text, decodes diagrams, and creates video lessons.
        </p>
      </div>

      {/* Main Grid: Upload Area on Left, Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Upload / Preview */}
        <div className="lg:col-span-5 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/60 rounded-3xl p-6 text-center cursor-pointer transition-all duration-200 hover:bg-slate-900 group flex flex-col items-center justify-center min-h-[260px] overflow-hidden"
          >
            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img
                  src={selectedImage}
                  alt="Academic Document"
                  className="max-h-[280px] w-auto rounded-xl object-contain border border-slate-700 shadow-md mb-3"
                />
                <span className="text-xs text-cyan-400 font-semibold group-hover:underline flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Click to replace photo
                </span>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-indigo-600/20 transition-all">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Drop your photo here or browse</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPG, PNG, Screenshots, Scanned Notes & PDF pages
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Custom Question input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Specific Question about this image (Optional)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g., 'Explain the 3rd step of this proof' or 'Find the syntax error'"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => handleAnalyze('general')}
              disabled={!selectedImage || isAnalyzing}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-40 transition-all"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Academic Image</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleAnalyze('teach_page')}
              disabled={!selectedImage || isAnalyzing}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 transition-all"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Teach Me This Page</span>
            </button>
          </div>

          {/* Sample Academic Images selector */}
          <div className="pt-4 space-y-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Try Sample Academic Illustrations:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {sampleAcademicImages.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s)}
                  className="text-left p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-xs transition-all flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-semibold text-slate-200">{s.title}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{s.description}</p>
                  </div>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {s.subject}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Output & Video Generator trigger */}
        <div className="lg:col-span-7">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs mb-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold">Analysis Notice</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {analysisResult ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
              {/* Clarity warning if image was blurry */}
              {analysisResult.clarityWarning && (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{analysisResult.clarityWarning}</span>
                </div>
              )}

              {/* Title & Subject Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-wide">
                    {analysisResult.subject}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1.5">{analysisResult.topic}</h3>
                </div>

                {/* Make a Video From This Page Button */}
                <button
                  onClick={() =>
                    onMakeVideoFromPage(
                      analysisResult.suggestedVideoTitle || analysisResult.topic,
                      analysisResult.explanation,
                      selectedImage || undefined
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Video className="w-4 h-4" />
                  <span>Make Video From This Page</span>
                </button>
              </div>

              {/* Extracted OCR Text & Equations */}
              {analysisResult.extractedText && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <FileScan className="w-3.5 h-3.5 text-indigo-400" />
                      Extracted Text & Equations (OCR)
                    </span>
                    <button
                      onClick={() => handleCopyText(analysisResult.extractedText)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {analysisResult.extractedText}
                  </pre>
                </div>
              )}

              {/* Step-by-Step Educational Explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  Step-by-Step Teacher Explanation
                </h4>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  {analysisResult.explanation}
                </div>
              </div>

              {/* Diagram / Chart Interpretation */}
              {analysisResult.diagramDescription && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Diagram & Visual Chart Breakdown
                  </h4>
                  <p className="text-xs text-slate-300 p-3.5 rounded-xl bg-amber-950/10 border border-amber-500/20 leading-relaxed">
                    {analysisResult.diagramDescription}
                  </p>
                </div>
              )}

              {/* Key Formulas or Concepts */}
              {analysisResult.keyFormulasOrConcepts?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Formulas & Definitions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keyFormulasOrConcepts.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Questions to Check Understanding */}
              {analysisResult.practiceQuestions?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Practice Questions from This Page
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.practiceQuestions.map((q, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="h-full min-h-[380px] rounded-3xl border border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                <FileScan className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-1">
                <h4 className="font-bold text-white text-base">No Page Analyzed Yet</h4>
                <p className="text-xs text-slate-400">
                  Select an academic image or choose one of the sample diagrams on the left to see
                  OCR extraction, formulas, and educational video generation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
