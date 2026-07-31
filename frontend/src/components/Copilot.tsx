import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  X, 
  Sparkles, 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Maximize2, 
  Minimize2, 
  ChevronRight, 
  Copy, 
  Check, 
  BookOpen, 
  LayoutDashboard, 
  Headphones, 
  HelpCircle, 
  Layers, 
  Users, 
  Compass, 
  Zap, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  suggestions?: string[];
  action?: {
    label: string;
    route: string;
  };
}

interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export const Copilot: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Persona / User info
  const userName = localStorage.getItem('user_name') || 'Manikanth';
  const userEmail = localStorage.getItem('user_email') || 'demo@EchoXScholar.ai';

  // Chat Threads State
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    try {
      const saved = localStorage.getItem('copilot_chat_threads_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    return [
      {
        id: 'initial-thread',
        title: 'Welcome to EchoX Copilot',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [
          {
            id: 'm-1',
            role: 'assistant',
            content: `Hello **${userName}**! 👋 I am **Professor Vox**, your AI Learning Copilot.\n\nI can help you navigate **EchoXScholar**, analyze research papers, generate quizzes, flashcards, or podcasts, and answer any questions grounded in your study material.\n\nHow can I assist your study session today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: [
              "What can you do on this page?",
              "Summarize my uploaded papers",
              "Open AI Podcast Generator",
              "Recommend my next study topic"
            ]
          }
        ]
      }
    ];
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => threads[0]?.id || 'initial-thread');

  // Persist threads to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('copilot_chat_threads_v2', JSON.stringify(threads));
    } catch (e) {}
  }, [threads]);

  // Active Thread Helper
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages, isGenerating, isOpen]);

  // Contextual prompts based on active route
  const getRouteContextPrompts = () => {
    const path = location.pathname;
    if (path.startsWith('/workspace')) {
      return [
        { label: "📄 Summarize active paper", action: "Summarize the active paper in 3 key bullet points" },
        { label: "🧩 Generate Quiz on Paper", action: "Generate a 3-question adaptive quiz from this paper" },
        { label: "🧠 Mind Map breakdown", action: "Create a concept breakdown map for this topic" }
      ];
    } else if (path === '/upload') {
      return [
        { label: "📤 How to upload papers?", action: "Explain how document text extraction works in EchoXScholar" },
        { label: "📑 Supported File Types", action: "What formats can I upload (PDF, DOCX, PPTX)?" }
      ];
    } else if (path === '/podcasts') {
      return [
        { label: "🎙️ Recommend Podcast Topic", action: "Recommend an engaging paper for podcast generation" },
        { label: "🗣️ Explain Audio Host Personas", action: "What are the available AI podcast host styles?" }
      ];
    } else if (path === '/quiz') {
      return [
        { label: "💡 Quiz Hints", action: "Give me study strategies for adaptive quizzes" },
        { label: "📈 View Analytics", action: "Open my analytics dashboard" }
      ];
    } else if (path === '/community') {
      return [
        { label: "👥 Recommend Study Groups", action: "Find study groups related to Machine Learning and Distributed Systems" }
      ];
    }
    return [
      { label: "📊 Go to Dashboard", action: "Open Dashboard" },
      { label: "🎓 Check Study Progress", action: "Analyze my overall learning progress and XP" },
      { label: "🚀 Start New Learning Session", action: "Recommend my next topic to study" }
    ];
  };

  // Create new Chat Thread
  const handleCreateNewThread = () => {
    const newId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      title: 'New Conversation',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: `m-${Date.now()}`,
          role: 'assistant',
          content: `Started a new study session! Ask me anything about your papers, quizzes, or learning goals.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: getRouteContextPrompts().map(p => p.action)
        }
      ]
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
    setShowHistory(false);
  };

  // Delete Chat Thread
  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (threads.length <= 1) return;
    const filtered = threads.filter(t => t.id !== id);
    setThreads(filtered);
    if (activeThreadId === id) {
      setActiveThreadId(filtered[0].id);
    }
  };

  // Copy message snippet
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Check for app actions in message
  const executeAppActionIfMatch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('dashboard') || q.includes('open dashboard')) {
      navigate('/dashboard');
      return "Navigating to your **Learning Dashboard**! 📊";
    }
    if (q.includes('podcast') || q.includes('podcasts')) {
      navigate('/podcasts');
      return "Opening **AI Audio Studio & Podcasts**! 🎙️";
    }
    if (q.includes('quiz') || q.includes('flashcard')) {
      navigate(q.includes('quiz') ? '/quiz' : '/flashcards');
      return `Navigating to **${q.includes('quiz') ? 'Adaptive Quizzes' : '3D Flashcards'}**! ⚡`;
    }
    if (q.includes('upload') || q.includes('import')) {
      navigate('/upload');
      return "Opening **PDF Upload & RAG Ingestion Workspace**! 📤";
    }
    if (q.includes('community') || q.includes('group')) {
      navigate('/community');
      return "Opening **Scholar Community & Study Groups**! 👥";
    }
    if (q.includes('research') || q.includes('bookmark') || q.includes('library')) {
      navigate('/research');
      return "Opening **My Research Library**! 📚";
    }
    if (q.includes('graph') || q.includes('mind map') || q.includes('flowchart')) {
      navigate('/graph');
      return "Opening **Interactive Knowledge Graph & Mind Maps**! 🧬";
    }
    return null;
  };

  // Send message to AI
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isGenerating) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message immediately
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        // Auto update thread title if it's new
        const updatedTitle = t.title === 'New Conversation' ? query.slice(0, 24) + '...' : t.title;
        return {
          ...t,
          title: updatedTitle,
          messages: [...t.messages, userMsg]
        };
      }
      return t;
    }));

    setInputQuery('');
    setIsGenerating(true);

    // Check direct action route trigger
    const actionResponse = executeAppActionIfMatch(query);
    if (actionResponse) {
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: actionResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, messages: [...t.messages, assistantMsg] } : t));
        setIsGenerating(false);
      }, 500);
      return;
    }

    // Call Backend AI Chat API
    try {
      const res = await api.post('/chat/ask', {
        question: query,
        agent_type: 'copilot',
        ai_model: 'gemini-2.0-flash'
      });

      const data = res.data;
      const assistantAnswer = data.answer || "I am here to guide your study session. Ask me anything!";

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: assistantAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations,
        suggestions: data.suggestions || [
          "Explain this step-by-step",
          "Create a quick quiz question",
          "Show related study papers"
        ]
      };

      setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, messages: [...t.messages, assistantMsg] } : t));
    } catch (err) {
      // Robust Context-Aware Offline Fallback
      console.warn("Copilot API fallback activated");
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: `### 🎓 Vox Copilot Response\n\nRegarding **"${query}"**:\n\nEchoXScholar provides end-to-end AI learning tools including:\n- **RAG Document Grounding**: Deep search into your uploaded PDFs.\n- **Adaptive Quizzes**: Real-time evaluation with Socratic feedback.\n- **AI Audio Overviews**: Dynamic dual-host podcasts.\n\n*Would you like to open the Research Workspace or generate flashcards on this topic?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "Open Workspace",
          "Generate Flashcards",
          "Go to Dashboard"
        ]
      };
      setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, messages: [...t.messages, fallbackMsg] } : t));
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredThreads = threads.filter(t => t.title.toLowerCase().includes(searchHistoryQuery.toLowerCase()));

  // Floating trigger button when closed
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300 flex items-center gap-3 border border-indigo-400/30 group"
        title="Open EchoX Vox Copilot"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse"></span>
        </div>
        <div className="hidden sm:flex flex-col items-start pr-1">
          <span className="text-xs font-bold tracking-wide uppercase text-indigo-100">Vox Copilot</span>
          <span className="text-[10px] text-indigo-200">AI Learning Assistant</span>
        </div>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isExpanded ? 'w-[calc(100vw-2rem)] sm:w-[580px] h-[calc(100vh-2rem)] max-h-[780px]' : 'w-[calc(100vw-2rem)] sm:w-[420px] h-[600px]'
      }`}
    >
      
      {/* 1. COPILOT HEADER (Glassmorphic Bar with Status & Actions) */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-4 flex items-center justify-between shadow-md shrink-0 border-b border-indigo-700/50">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-white shadow-inner">
            <Bot className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Vox Copilot</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80 line-clamp-1">
              Context: {location.pathname === '/' ? 'Discover Hub' : location.pathname.slice(1)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            className={`p-2 rounded-lg transition-colors text-indigo-200 hover:text-white hover:bg-white/10 ${showHistory ? 'bg-white/20 text-white' : ''}`}
            title="Chat History"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleCreateNewThread} 
            className="p-2 rounded-lg transition-colors text-indigo-200 hover:text-white hover:bg-white/10"
            title="New Chat Session"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="p-2 rounded-lg transition-colors text-indigo-200 hover:text-white hover:bg-white/10"
            title={isExpanded ? "Collapse Window" : "Expand Window"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 rounded-lg transition-colors text-indigo-200 hover:text-white hover:bg-white/10"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. CHAT HISTORY DRAWER OVERLAY */}
      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 space-y-3 shrink-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Conversation Sessions</span>
              <button 
                onClick={handleCreateNewThread}
                className="btn-primary text-xs py-1 px-2.5 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Session
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search history..."
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
              {filteredThreads.map(t => (
                <div 
                  key={t.id}
                  onClick={() => {
                    setActiveThreadId(t.id);
                    setShowHistory(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    t.id === activeThreadId 
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 font-medium' 
                      : 'hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="truncate max-w-[240px]">{t.title}</span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span>{t.createdAt}</span>
                    {threads.length > 1 && (
                      <button 
                        onClick={(e) => handleDeleteThread(t.id, e)}
                        className="hover:text-red-500 p-0.5 rounded transition-colors"
                        title="Delete Session"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MESSAGES SCROLLABLE CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
        
        {activeThread?.messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-medium text-gray-400">
                {msg.role === 'user' ? userName : 'Vox Copilot'}
              </span>
              <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
            </div>

            <div 
              className={`relative max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/80 rounded-bl-none shadow-sm'
              }`}
            >
              {/* Message Content */}
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap font-sans">{msg.content}</p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-2">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}

              {/* Citations if available */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/60 space-y-1">
                  <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-500" /> Document Grounded Citations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((c, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy message button */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.content, msg.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors"
                  title="Copy response"
                >
                  {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {/* Suggested follow-up prompt pills */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                {msg.suggestions.map((s, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSendMessage(s)}
                    className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>{s}</span>
                    <ChevronRight className="w-3 h-3 text-indigo-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isGenerating && (
          <div className="flex flex-col items-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">Vox Copilot is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. ROUTE CONTEXT QUICK PROMPTS BAR */}
      <div className="px-3 py-2 bg-indigo-50/60 dark:bg-indigo-950/30 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-semibold uppercase text-indigo-600 dark:text-indigo-400 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" /> Quick Actions:
        </span>
        {getRouteContextPrompts().map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.action)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 transition-colors shadow-2xs"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 5. INPUT FORM */}
      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Vox Copilot anything about your studies..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isGenerating}
            className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-gray-900 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isGenerating}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-medium transition-all shadow-sm shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
export default Copilot;
