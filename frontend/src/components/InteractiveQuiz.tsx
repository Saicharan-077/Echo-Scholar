import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy, 
  RefreshCw, 
  Sparkles, 
  Loader2, 
  HelpCircle, 
  BookOpen, 
  Award,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';

export interface QuestionItem {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface InteractiveQuizProps {
  paperId?: number;
  paperTitle?: string;
  onBack?: () => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  paperId,
  paperTitle = 'Attention Is All You Need — Transformer Architecture',
  onBack
}) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  // Fallback initial questions grounded in Attention Is All You Need
  const defaultQuestions: QuestionItem[] = [
    {
      q: "Why does the Transformer model calculate Query (Q), Key (K), and Value (V) dot-products in parallel?",
      options: [
        "To eliminate sequential RNN recurrence bottlenecks and parallelize matrix multiplication across GPU cores.",
        "To compress embedding dimensions by 50% without loss of sequence order information.",
        "To restrict the maximum token sequence length to 128 tokens.",
        "To encrypt input embeddings before multi-head attention processing."
      ],
      correct: 0,
      explanation: "RNNs require O(N) sequential operations step-by-step. Self-attention calculates pairwise token interactions in parallel O(1) sequential matrix operations, accelerating GPU training."
    },
    {
      q: "Why is Scaled Dot-Product Attention divided by sqrt(d_k)?",
      options: [
        "To scale vector dimensions down for low-memory edge deployment.",
        "To counteract large dot-product magnitudes that push the softmax function into regions with vanishing gradients.",
        "To force positional encodings to be orthogonal across all attention heads.",
        "To enforce non-negative attention weight distributions."
      ],
      correct: 1,
      explanation: "For large key dimensions (d_k), dot products grow large in magnitude, pushing softmax into extreme regions where gradients are extremely small. Dividing by sqrt(d_k) stabilizes gradients during backpropagation."
    },
    {
      q: "What is the primary function of Positional Encodings in Transformer architectures?",
      options: [
        "To encrypt sensitive user tokens prior to feed-forward projection.",
        "To inject sequence order awareness into input embeddings since self-attention contains no inherent sequence order information.",
        "To reduce model parameter count by sharing weights across encoder layers.",
        "To normalize hidden state activations between attention blocks."
      ],
      correct: 1,
      explanation: "Self-attention treats input sequence as a bag of tokens with zero inherent order awareness. Positional encodings (sinusoidal or learned) add sequence position information directly to input embeddings."
    }
  ];

  // Fetch or generate quiz from backend
  const fetchQuiz = async () => {
    setLoading(true);
    setIsFinished(false);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setResultData(null);

    try {
      const res = await api.post('/quiz/generate', {
        paper_id: paperId || 1,
        topic: paperTitle,
        difficulty: 'Medium',
        num_questions: 3
      });

      if (res.data && res.data.questions && res.data.questions.length > 0) {
        const parsed = res.data.questions.map((q: any) => ({
          q: q.q || q.question,
          options: q.options || [],
          correct: typeof q.correct === 'number' ? q.correct : (q.correct_option || 0),
          explanation: q.explanation || 'Answer grounded in active document context.'
        }));
        setQuestions(parsed);
      } else {
        setQuestions(defaultQuestions);
      }
    } catch (err) {
      console.warn('Backend quiz endpoint fallback:', err);
      setQuestions(defaultQuestions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [paperId]);

  const handleSelectOption = (optIdx: number) => {
    if (submittedQuestions[currentIdx]) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleSubmitQuestion = () => {
    if (selectedAnswers[currentIdx] === undefined) return;
    setSubmittedQuestions(prev => ({ ...prev, [currentIdx]: true }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsSubmitting(true);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);

    try {
      const res = await api.post('/quiz/submit', {
        subject: paperTitle,
        topic: paperTitle,
        difficulty: 'Medium',
        user_answers: selectedAnswers,
        questions: questions.map((q, idx) => ({
          question: q.q,
          correct_option: q.correct
        }))
      });
      setResultData(res.data);
    } catch (e) {
      setResultData({
        score_percentage: scorePct,
        correct_count: correctCount,
        total_questions: questions.length,
        misconception_analysis: scorePct >= 80 ? "Outstanding mastery of core self-attention mechanisms!" : "Review positional encodings and scaling factor sections."
      });
    } finally {
      setIsSubmitting(false);
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center space-y-4 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
        <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-700">Generating Document-Grounded Socratic Quiz...</p>
        <p className="text-xs text-gray-400">Extracting key concepts from {paperTitle}</p>
      </div>
    );
  }

  // Quiz Finished View
  if (isFinished) {
    const scorePct = resultData?.score_percentage ?? Math.round((Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)] === questions[Number(k)].correct).length / questions.length) * 100);
    const correctCount = resultData?.correct_count ?? Object.keys(selectedAnswers).filter(k => selectedAnswers[Number(k)] === questions[Number(k)].correct).length;

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <div>
            {onBack && (
              <button onClick={onBack} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-1 block">
                ← Back to Paper Reader
              </button>
            )}
            <h2 className="text-2xl font-extrabold text-gray-900">Quiz Summary & Analysis</h2>
            <p className="text-xs text-gray-500">Document Mastery Evaluation</p>
          </div>
        </div>

        <div className="p-8 bg-white border border-gray-200/80 rounded-2xl space-y-6 shadow-xs text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="badge-accent text-xs font-bold uppercase tracking-wider mb-2 inline-block">Evaluation Complete</span>
            <h3 className="text-3xl font-extrabold text-gray-900">{scorePct}% Mastery Score</h3>
            <p className="text-sm text-gray-600 mt-1">
              You answered <strong className="text-gray-900">{correctCount}</strong> out of <strong className="text-gray-900">{questions.length}</strong> questions correctly.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-left space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Misconception Feedback
            </span>
            <p className="text-xs text-gray-700 leading-relaxed">
              {resultData?.misconception_analysis || (scorePct >= 80 ? "Great job! You demonstrated deep understanding of vector transformations and parallelization mechanics." : "Consider reviewing positional encodings and scaling factors before retrying.")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={fetchQuiz}
              className="btn-secondary flex-1 py-2.5 text-xs flex justify-center items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry Quiz
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="btn-primary flex-1 py-2.5 text-xs flex justify-center items-center gap-2"
              >
                Back to Reader <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isCurrentSubmitted = submittedQuestions[currentIdx] || false;
  const currentSelectedOpt = selectedAnswers[currentIdx];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
        <div>
          {onBack && (
            <button onClick={onBack} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-1 block">
              ← Back to Paper Reader
            </button>
          )}
          <h2 className="text-2xl font-extrabold text-gray-900">Socratic Active Recall Quiz</h2>
          <p className="text-xs text-gray-500 line-clamp-1">{paperTitle}</p>
        </div>
        <Badge variant="accent" size="sm">
          Question {currentIdx + 1} of {questions.length}
        </Badge>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 bg-white border border-gray-200/80 rounded-2xl space-y-6 shadow-xs">
        
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-4 h-4" /> Active Recall Challenge
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            {currentQ.q}
          </h3>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, optIdx) => {
            let styleClass = "border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 text-gray-800";
            let badgeIcon = null;

            if (isCurrentSubmitted) {
              if (optIdx === currentQ.correct) {
                styleClass = "border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold ring-2 ring-emerald-500/20";
                badgeIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (optIdx === currentSelectedOpt) {
                styleClass = "border-red-400 bg-red-50/80 text-red-900 font-semibold";
                badgeIcon = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
              }
            } else if (optIdx === currentSelectedOpt) {
              styleClass = "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold ring-2 ring-indigo-600/20";
            }

            return (
              <button
                key={optIdx}
                disabled={isCurrentSubmitted}
                onClick={() => handleSelectOption(optIdx)}
                className={`p-4 rounded-xl border transition-all text-left flex items-start justify-between gap-3 text-sm font-medium leading-relaxed ${styleClass}`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0 border border-gray-200">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {badgeIcon}
              </button>
            );
          })}
        </div>

        {/* Feedback Explanation */}
        {isCurrentSubmitted && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1 animate-in fade-in duration-200">
            <span className={`text-xs font-bold uppercase tracking-wider ${currentSelectedOpt === currentQ.correct ? 'text-emerald-700' : 'text-red-600'}`}>
              {currentSelectedOpt === currentQ.correct ? '✓ Correct Answer' : '✕ Incorrect'}
            </span>
            <p className="text-xs text-gray-700 leading-relaxed font-sans mt-0.5">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Actions Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-400 font-medium">
            Progress: {currentIdx + 1} / {questions.length} Questions
          </div>

          <div>
            {!isCurrentSubmitted ? (
              <button
                onClick={handleSubmitQuestion}
                disabled={currentSelectedOpt === undefined}
                className="btn-primary text-xs px-6 py-2.5 disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="btn-primary text-xs px-6 py-2.5 flex items-center gap-1.5"
              >
                {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish & Calculate Score'} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
