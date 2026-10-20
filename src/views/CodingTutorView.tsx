import React, { useState } from 'react';
import {
  Code2,
  Play,
  Bug,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  AlertCircle,
  HelpCircle,
  FileCode,
  Zap,
} from 'lucide-react';
import { CodeAnalysisResult } from '../types';
import { apiService } from '../services/api';

export const CodingTutorView: React.FC = () => {
  const languages = ['Python', 'JavaScript', 'C++', 'Java', 'C', 'HTML', 'CSS', 'SQL'];

  const [selectedLang, setSelectedLang] = useState<string>('Python');
  const [taskMode, setTaskMode] = useState<'explain' | 'debug_fix' | 'optimize' | 'step_by_step'>('explain');
  const [codeSnippet, setCodeSnippet] = useState<string>(`# Binary Search in Python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1

# Example array and target
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print("Index found:", binary_search(numbers, 23))`);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<CodeAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const sampleSnippets: { [key: string]: string } = {
    Python: `# Buggy Fibonacci Memoization
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]

print("Fibonacci(10):", fib(10))`,
    JavaScript: `// Asynchronous API Fetch and Error Handling
async function fetchStudentGrades(studentId) {
  try {
    const res = await fetch(\`/api/grades/\${studentId}\`);
    if (!res.ok) throw new Error("Grade lookup failed");
    const data = await res.json();
    return data.courses.map(c => ({ course: c.name, score: c.score }));
  } catch (err) {
    console.error("Fetch error:", err.message);
    return [];
  }
}`,
    'C++': `#include <iostream>
#include <vector>

// Two Sum problem in C++
std::pair<int, int> twoSum(const std::vector<int>& nums, int target) {
    for (size_t i = 0; i < nums.size(); ++i) {
        for (size_t j = i + 1; j < nums.size(); ++j) {
            if (nums[i] + nums[j] == target) return {i, j};
        }
    }
    return {-1, -1};
}

int main() {
    std::vector<int> v = {2, 7, 11, 15};
    auto res = twoSum(v, 9);
    std::cout << "Indices: " << res.first << ", " << res.second << std::endl;
    return 0;
}`,
    SQL: `-- Find Top 3 Students with Highest Average Marks
SELECT s.student_id, s.name, AVG(e.grade) AS avg_grade
FROM students s
JOIN enrollments e ON s.student_id = e.student_id
WHERE e.semester = 'Fall 2026'
GROUP BY s.student_id, s.name
HAVING COUNT(e.course_id) >= 3
ORDER BY avg_grade DESC
LIMIT 3;`,
  };

  const handleSelectLanguage = (lang: string) => {
    setSelectedLang(lang);
    if (sampleSnippets[lang]) {
      setCodeSnippet(sampleSnippets[lang]);
    }
    setAnalysis(null);
  };

  const handleAnalyzeCode = async (task = taskMode) => {
    if (!codeSnippet.trim()) return;

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);

      const result = await apiService.analyzeCode(codeSnippet, selectedLang, task);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to analyze code.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Computer Science & Code Tutor</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Programming & Code Tutor
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl">
          Paste code in Python, C++, Java, JS, HTML, or SQL. Get line-by-line breakdowns, bug
          detection, time/space complexity, and execution logic.
        </p>
      </div>

      {/* Language Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleSelectLanguage(lang)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedLang === lang
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Code Editor and Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code Input & Action bar */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Window title bar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  code_snippet.{selectedLang.toLowerCase() === 'c++' ? 'cpp' : selectedLang.toLowerCase()}
                </span>
              </div>
              <button
                onClick={() => handleCopy(codeSnippet)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Textarea code editor */}
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={16}
              className="w-full bg-slate-950 p-4 font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed selection:bg-emerald-500/30"
              placeholder="Paste any code here to analyze..."
            />
          </div>

          {/* Task Action Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'explain', label: 'Line by Line', icon: FileCode },
              { id: 'debug_fix', label: 'Find Bugs & Fix', icon: Bug },
              { id: 'optimize', label: 'Time Complexity', icon: Zap },
              { id: 'step_by_step', label: 'Trace Output', icon: Terminal },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTaskMode(t.id as any);
                  handleAnalyzeCode(t.id as any);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  taskMode === t.id
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleAnalyzeCode(taskMode)}
            disabled={!codeSnippet.trim() || isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 disabled:opacity-40 transition-all hover:scale-[1.01]"
          >
            {isAnalyzing ? (
              <>
                <Terminal className="w-4 h-4 animate-spin" />
                <span>Tutor analyzing code execution...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Code Tutor Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Breakdown & Debugging Output */}
        <div className="lg:col-span-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs mb-4">
              {errorMsg}
            </div>
          )}

          {analysis ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Summary */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Code Breakdown
                </span>
                <p className="text-sm text-slate-200 mt-2 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Complexity Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Time Complexity
                  </span>
                  <span className="text-sm font-mono font-bold text-cyan-400">
                    {analysis.timeComplexity || 'O(n)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    Space Complexity
                  </span>
                  <span className="text-sm font-mono font-bold text-purple-400">
                    {analysis.spaceComplexity || 'O(1)'}
                  </span>
                </div>
              </div>

              {/* Errors Found & Corrections */}
              {analysis.errorsFound?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Identified Bugs & Corrections</span>
                  </h4>
                  <div className="space-y-2">
                    {analysis.errorsFound.map((err, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs space-y-1"
                      >
                        <div className="font-semibold text-red-300">
                          Line {err.line}: {err.issue}
                        </div>
                        <div className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                          Fix: {err.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Line-by-Line Breakdown */}
              {analysis.lineByLine?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    Line-by-Line Explanation
                  </h4>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {analysis.lineByLine.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                      >
                        <div className="font-mono text-emerald-300 text-[11px] flex items-center gap-2">
                          <span className="text-slate-500 font-semibold">{item.lineNumber}.</span>
                          <span>{item.line}</span>
                        </div>
                        <p className="text-slate-400 pl-4 text-[11px] leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Challenge */}
              {analysis.practiceChallenge && (
                <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    💡 Mini Coding Challenge
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analysis.practiceChallenge}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[380px] rounded-2xl border border-slate-800 bg-slate-900/30 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
              <Terminal className="w-12 h-12 text-slate-600" />
              <h4 className="text-base font-bold text-white">No Analysis Yet</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Click "Run Code Tutor Analysis" or select a mode above to see explanations and bug fixes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
