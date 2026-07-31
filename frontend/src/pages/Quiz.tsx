import React, { useState } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const quizData = [
    {
      question: "Which matrix is NOT typically learned during the Self-Attention mechanism in Transformers?",
      options: [
        "Query Matrix (W_Q)",
        "Key Matrix (W_K)",
        "Value Matrix (W_V)",
        "Positional Encoding Matrix (W_P)"
      ],
      correctAnswer: 3,
      explanation: "Positional encodings are typically added (or concatenated) to the input embeddings and use fixed sine/cosine functions or learned parameters separately, but they are not the core Q, K, V learned weight matrices of the attention mechanism itself."
    },
    {
      question: "Why is the dot product of Query and Key scaled by the inverse square root of the dimension (d_k)?",
      options: [
        "To prevent softmax from vanishing gradients",
        "To increase the learning rate",
        "To normalize the input vectors",
        "To make the matrix multiplication faster"
      ],
      correctAnswer: 0,
      explanation: "For large dimensions, the dot products grow large in magnitude, pushing the softmax function into regions where gradients are extremely small (vanishing gradients). Scaling by sqrt(d_k) counteracts this."
    }
  ];

  const handleSelect = (index: number) => {
    if (!isSubmitted) setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const currentQ = quizData[currentQuestion];

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="saas-card p-8 sm:p-12 max-w-md w-full text-center space-y-6 rounded-2xl bg-white dark:bg-gray-800 dark:border-gray-700">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Completed!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You scored <span className="font-bold text-indigo-600 dark:text-indigo-400">{score}</span> out of {quizData.length}.
          </p>
          <div className="flex gap-4 pt-4">
            <button onClick={() => window.location.reload()} className="btn-secondary w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 flex justify-center items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
            <Link to="/community" className="btn-primary w-full flex justify-center items-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto transition-colors">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Adaptive AI Quiz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Concept Check</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Question {currentQuestion + 1} of {quizData.length}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
          <span className="text-sm text-gray-500 block">Score</span>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="saas-card p-6 sm:p-8 rounded-2xl bg-white dark:bg-gray-800 dark:border-gray-700 space-y-8">
        <h2 className="text-xl sm:text-2xl font-semibold leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let styleClass = "border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-gray-900";
            let icon = null;

            if (isSubmitted) {
              if (idx === currentQ.correctAnswer) {
                styleClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-gray-800";
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
              } else if (idx === selectedAnswer) {
                styleClass = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-300";
                icon = <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
              }
            } else if (idx === selectedAnswer) {
              styleClass = "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-gray-800";
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between font-medium ${styleClass}`}
              >
                <span>{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Action Button & Explanation */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-6 items-center justify-between">
          
          <div className="flex-1">
            {isSubmitted && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <span className={`text-sm font-bold ${selectedAnswer === currentQ.correctAnswer ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {selectedAnswer === currentQ.correctAnswer ? 'Correct!' : 'Incorrect.'}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all ${
                  selectedAnswer !== null
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto btn-primary px-8 py-3 rounded-xl flex items-center justify-center gap-2"
              >
                {currentQuestion < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
