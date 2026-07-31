import React, { useState, useEffect } from 'react';
import { Bot, X, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Copilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [link, setLink] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Proactive suggestion logic based on route
    let timer: NodeJS.Timeout;

    const generateSuggestion = () => {
      if (location.pathname.includes('/quiz')) {
        setSuggestion("Struggling with attention mechanisms? Let's review the flashcards first.");
        setLink('/flashcards');
      } else if (location.pathname.includes('/flashcards')) {
        setSuggestion("You've mastered this set! Ready for a quick quiz?");
        setLink('/quiz');
      } else if (location.pathname === '/') {
        setSuggestion("Welcome back! Your daily streak is 7. Let's study for 20 mins to keep it going.");
        setLink('/workspace');
      } else if (location.pathname === '/community') {
        setSuggestion("There's an active discussion on 'Transformers' right now. Jump in!");
        setLink('/community/1');
      } else {
        setSuggestion("Want me to summarize your recent uploads?");
        setLink('/research');
      }
      setIsOpen(true);
    };

    // Show suggestion after 3 seconds on a new page (mocking proactive AI)
    timer = setTimeout(generateSuggestion, 3000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all z-50 animate-bounce group"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden flex flex-col">
      <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-bold text-sm">EchoX Copilot</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl rounded-tl-none border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {suggestion}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          {link && (
            <Link to={link} onClick={() => setIsOpen(false)} className="btn-primary w-full py-2.5 text-xs flex justify-center items-center gap-2">
              Action Suggested <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <button className="btn-secondary w-full py-2.5 text-xs flex justify-center items-center gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600">
            <MessageSquare className="w-4 h-4" /> Ask me anything
          </button>
        </div>
      </div>
    </div>
  );
};
