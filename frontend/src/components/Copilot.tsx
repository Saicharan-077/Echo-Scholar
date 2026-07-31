import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  X, 
  Sparkles, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export const Copilot: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: `Hi! I am **Vox AI**, your learning copilot. How can I help you study today?`,
      suggestions: [
        "Go to Dashboard",
        "Summarize active paper",
        "Generate a Quiz",
        "Open Podcasts"
      ]
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating, isOpen]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeActionIfMatch = (q: string): string | null => {
    const query = q.toLowerCase();
    if (query.includes('dashboard')) {
      navigate('/dashboard');
      return "Navigated to your **Dashboard**! 📊";
    }
    if (query.includes('podcast')) {
      navigate('/podcasts');
      return "Opened **AI Audio Overviews & Podcasts**! 🎙️";
    }
    if (query.includes('quiz') || query.includes('flashcard')) {
      navigate(query.includes('quiz') ? '/quiz' : '/flashcards');
      return `Opened **${query.includes('quiz') ? 'Quizzes' : 'Flashcards'}**! ⚡`;
    }
    if (query.includes('upload')) {
      navigate('/upload');
      return "Opened **PDF Upload Workspace**! 📤";
    }
    if (query.includes('community')) {
      navigate('/community');
      return "Opened **Community & Study Groups**! 👥";
    }
    if (query.includes('research') || query.includes('bookmark')) {
      navigate('/research');
      return "Opened **My Research Library**! 📚";
    }
    if (query.includes('graph') || query.includes('mind map')) {
      navigate('/graph');
      return "Opened **Knowledge Graph & Mind Map**! 🧬";
    }
    return null;
  };

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim() || isGenerating) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsGenerating(true);

    const actionResult = executeActionIfMatch(text);
    if (actionResult) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: actionResult
          }
        ]);
        setIsGenerating(false);
      }, 400);
      return;
    }

    try {
      const res = await api.post('/chat/ask', {
        question: text,
        agent_type: 'copilot',
        ai_model: 'gemini-2.0-flash'
      });

      const reply = res.data.answer || "I'm here to help with your research and study goals!";
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          suggestions: res.data.suggestions || [
            "Explain step-by-step",
            "Generate 3 flashcards",
            "Go to Dashboard"
          ]
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: `**Vox Copilot:** EchoXScholar integrates document RAG search, adaptive quizzes, and AI podcast generation to accelerate your research.\n\n*Would you like to open your research workspace or dashboard?*`,
          suggestions: ["Go to Dashboard", "Open PDF Upload", "Generate Quiz"]
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 p-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl hover:scale-105 transition-all flex items-center gap-2 group"
        title="Open Gemini Copilot Assistant"
      >
        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">Ask AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[360px] sm:w-[400px] h-[520px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all">
      
      {/* Copilot Header */}
      <div className="bg-indigo-600 dark:bg-indigo-900 text-white p-3.5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span className="font-bold text-sm">Vox AI Copilot</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setMessages([{ id: 'm-1', role: 'assistant', content: 'Hi! I am **Vox AI**, your learning copilot. How can I help you study today?' }])}
            className="p-1 text-indigo-200 hover:text-white rounded transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-indigo-200 hover:text-white rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gray-50/50 dark:bg-gray-950/50">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`relative max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none shadow-2xs'
            }`}>
              {m.role === 'user' ? (
                <p className="whitespace-pre-wrap">{m.content}</p>
              ) : (
                <div className="prose prose-xs dark:prose-invert max-w-none">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )}

              {m.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(m.content, m.id)}
                  className="absolute top-1.5 right-1.5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>

            {m.suggestions && m.suggestions.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {m.suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition-colors flex items-center gap-0.5"
                  >
                    <span>{s}</span>
                    <ChevronRight className="w-3 h-3 text-indigo-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-1.5 p-2 bg-white dark:bg-gray-800 rounded-xl w-fit border border-gray-200 dark:border-gray-700 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span>AI is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2.5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask Vox Copilot..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={isGenerating}
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-indigo-600"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isGenerating}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
export default Copilot;
