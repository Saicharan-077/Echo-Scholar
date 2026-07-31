import React, { useState } from 'react';
import { 
  Layers, 
  Brain, 
  Star, 
  Bookmark, 
  Check, 
  X, 
  RefreshCw,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const Flashcards: React.FC = () => {
  const [cards] = useState([
    {
      id: 1,
      front: 'What is the primary function of the Self-Attention mechanism?',
      back: 'It allows the model to weigh the importance of different words in a sequence when encoding a particular word, capturing contextual relationships regardless of distance.',
      explanation: 'Analogy: Imagine a cocktail party. You focus (attend) to the voice of the person you are talking to, while ignoring the background noise. Self-attention does this mathematically for every word in a sentence.'
    },
    {
      id: 2,
      front: 'Define Q, K, and V in Transformers.',
      back: 'Query (what I am looking for), Key (what I have), and Value (what I actually am). The attention score is calculated by dotting Q and K, scaling, softmaxing, and multiplying by V.',
      explanation: 'Like a database search: You type a Query, it matches against Keys of articles, and returns the Values (contents) of the best matches.'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setShowExplanation(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setShowExplanation(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto transition-colors">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between rounded-xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Spaced Repetition Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Smart Flashcards</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Reviewing: Attention Is All You Need • {currentIndex + 1} / {cards.length}
          </p>
        </div>
      </div>

      {/* Flashcard Area */}
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="perspective-1000 w-full h-80 relative cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
          <div className={`w-full h-full duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-gray-700 rounded-3xl shadow-lg flex flex-col p-8 justify-center items-center text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                {currentCard.front}
              </h2>
              <p className="absolute bottom-6 text-sm text-gray-400 font-medium">Click to flip</p>
            </div>

            {/* Back */}
            <div className="absolute w-full h-full backface-hidden bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl shadow-lg flex flex-col p-8 justify-center items-center text-center rotate-y-180">
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                {currentCard.back}
              </p>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowExplanation(!showExplanation); }}
                className="absolute bottom-6 flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                <Brain className="w-4 h-4" /> 
                {showExplanation ? 'Hide AI Analogy' : 'Explain like I am 5'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Explanation Popover */}
        {showExplanation && isFlipped && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-sm flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4" /> AI Explanation
            </h4>
            <p className="text-sm text-indigo-100 leading-relaxed">
              {currentCard.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-yellow-500 hover:border-yellow-200 transition-colors shadow-sm">
              <Star className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-200 transition-colors shadow-sm">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={prevCard} className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 shadow-sm transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button onClick={nextCard} className="btn-secondary px-6 py-3 rounded-xl bg-white dark:bg-gray-800 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold flex items-center gap-2">
              <X className="w-4 h-4" /> Hard (Review Soon)
            </button>
            <button onClick={nextCard} className="btn-primary px-6 py-3 rounded-xl bg-emerald-600 border-emerald-700 hover:bg-emerald-700 text-white font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> Easy (Got it!)
            </button>

            <button onClick={nextCard} className="p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 shadow-sm transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
