import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Brain, 
  Headphones, 
  Layers, 
  HelpCircle, 
  FileText, 
  Search, 
  Command, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Maximize2, 
  Minimize2, 
  Bookmark, 
  Share2, 
  Download, 
  Send,
  MessageSquare,
  Play,
  Pause,
  RotateCcw,
  XCircle,
  MoreHorizontal,
  ChevronRight,
  Compass,
  Clock,
  Zap,
  ChevronDown
} from 'lucide-react';

interface ResearchWorkspaceProps {
  onOpenSearch?: () => void;
}

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({ onOpenSearch }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Active workspace state
  const [activePaperIndex, setActivePaperIndex] = useState(0);
  const [activeDockPanel, setActiveDockPanel] = useState<'graph' | 'podcast' | 'quiz' | 'notes' | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(72);
  const [isRelatedOpen, setIsRelatedOpen] = useState(false);

  // Floating AI Selection Context Menu state
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Professor Vox Assistant state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string; citation?: string }[]>([
    {
      role: 'assistant',
      text: `Welcome back, Manikanth!\n\nYesterday you finished **Section 2: Self-Attention Mechanics**.\n\nToday's Focus: **Section 3: Multi-Head Attention**.\nEst. Reading Time: **18 minutes**.`
    }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // ESC Key listener for Focus Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  // Pre-seeded multi-paper workspace papers
  const papers = [
    {
      id: 'transformer-1',
      title: 'Attention Is All You Need',
      authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
      category: 'Transformers & LLMs',
      sections: [
        { id: 'sec-1', status: 'completed', title: '1. Abstract & Introduction', content: 'Dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.' },
        { id: 'sec-2', status: 'active', title: '2. Model Architecture & Scaled Dot-Product Attention', content: 'An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.\n\nAttention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V\n\nWe compute the dot products of the query with all keys, divide each by sqrt(d_k), and apply a softmax function to obtain the weights on the values.' },
        { id: 'sec-3', status: 'upcoming', title: '3. Multi-Head Attention & Positional Encoding', content: 'Instead of performing a single attention function with d_model-dimensional keys, values and queries, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding d_v-dimensional output values. Positional encodings are added to the input embeddings to inject sequence order into the model.' }
      ]
    },
    {
      id: 'resnet-2',
      title: 'Deep Residual Learning for Image Recognition',
      authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
      category: 'Computer Vision',
      sections: [
        { id: 'sec-1', status: 'upcoming', title: '1. Abstract & Residual Learning Framework', content: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.' }
      ]
    }
  ];

  const activePaper = papers[activePaperIndex] || papers[0];

  const relatedPapers = [
    { title: 'BERT: Pre-training of Deep Bidirectional Transformers', topic: 'Pre-training' },
    { title: 'Language Models are Few-Shot Learners (GPT-3)', topic: 'Autoregressive' },
    { title: 'RoBERTa: A Robustly Optimized BERT Pretraining Approach', topic: 'Optimization' },
    { title: 'Llama 3: Open Foundation Models', topic: 'Modern LLMs' }
  ];

  // Handle Text Selection for Floating AI Toolbar
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowMoreActions(false);
    } else {
      setSelectedText('');
      setMenuPosition(null);
    }
  };

  const handleAIContextAction = (actionLabel: string) => {
    const textToProcess = selectedText;
    setSelectedText('');
    setMenuPosition(null);

    setChatMessages(prev => [
      ...prev,
      { role: 'user', text: `${actionLabel}: "${textToProcess}"` }
    ]);
    setIsThinking(true);

    setTimeout(() => {
      let aiExplanation = '';
      if (actionLabel.includes('Explain') || actionLabel.includes('Simplify')) {
        aiExplanation = `### 💡 Contextual Insight\n\nBuilding on your knowledge of RNNs, "${textToProcess}" means computing how every word connects to every other word simultaneously. Rather than processing sequentially, the Transformer computes all connections in parallel across GPU threads.`;
      } else if (actionLabel.includes('Visualize')) {
        aiExplanation = `### 📊 Concept Flowchart\n\n\`\`\`\nInput Tokens -> [ Query (Q) | Key (K) | Value (V) ]\n                     |\n             (Q * K^T) / sqrt(d_k)\n                     |\n                 Softmax Weights -> Output Matrix\n\`\`\``;
      } else if (actionLabel.includes('Math')) {
        aiExplanation = `### 📐 Mathematical Proof\n\n$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\nScaling by $\\sqrt{d_k}$ prevents the dot product from pushing softmax into extremely small gradient regions.`;
      } else {
        aiExplanation = `Saved insight for "${textToProcess}" to study notes and updated concept DAG!`;
      }

      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: aiExplanation, citation: `📄 ${activePaper.title} • Section 2` }
      ]);
      setIsThinking(false);
    }, 600);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const userText = userQuery.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setUserQuery('');
    setIsThinking(true);

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `### 📄 Grounded Explanation\n\nRegarding "${userText}": Self-attention allows tokens to dynamically attend to all other token positions in a single matrix operation. Positional encodings are added to preserve order.`,
          citation: `📄 ${activePaper.title} • Section 2`
        }
      ]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="h-screen w-screen bg-white text-gray-900 font-sans flex flex-col overflow-hidden fixed inset-0 z-50">
      
      {/* 1. IMMERSIVE COMPACT WORKSPACE HEADER (No Website Navbar) */}
      <header className="h-13 border-b border-gray-200/80 px-5 flex items-center justify-between shrink-0 bg-white select-none">
        <div className="flex items-center gap-3">
          <Link to="/research" className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            ← My Research
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-xs font-bold text-gray-900">LLM Study</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500 font-medium">{activePaper.title}</span>
        </div>

        {/* Center Paper Switcher Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200">
          {papers.map((paper, idx) => (
            <button
              key={paper.id}
              onClick={() => setActivePaperIndex(idx)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePaperIndex === idx ? 'btn-primary shadow-xs' : 'btn-secondary border-none hover:bg-white text-gray-600'
              }`}
            >
              {paper.title}
            </button>
          ))}
        </div>

        {/* Right Tools & Progress */}
        <div className="flex items-center gap-3">
          <span className="badge-accent text-xs px-3 py-1">{readingProgress}% Complete</span>

          <button
            onClick={onOpenSearch}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <kbd className="font-mono text-[10px] text-gray-500">⌘K</kbd>
          </button>

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`text-xs font-semibold px-3 py-1.5 transition-all flex items-center gap-1.5 ${
              isFocusMode
                ? 'btn-primary'
                : 'btn-secondary'
            }`}
            title="Focus Mode (ESC to exit)"
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFocusMode ? 'Exit Focus' : 'Focus'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN THREE-PANE WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden relative" onMouseUp={handleTextSelection}>
        
        {/* LEFT SIDEBAR (18% Width): LEARNING JOURNEY & RELATED RESEARCH */}
        {!isFocusMode && (
          <aside className="w-[18%] min-w-[220px] max-w-[280px] bg-white border-r border-gray-200/80 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
            <div className="p-4 space-y-6 overflow-y-auto">
              
              {/* Learning Journey Stepper */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Learning Journey</p>
                  <span className="text-xs font-bold text-indigo-600">{readingProgress}%</span>
                </div>

                <div className="space-y-1">
                  {activePaper.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className={`p-2 rounded-lg text-xs font-medium transition-all flex items-start gap-2 ${
                        sec.status === 'completed'
                          ? 'text-gray-400 line-through'
                          : sec.status === 'active'
                          ? 'text-indigo-950 font-bold bg-indigo-50 border-l-2 border-l-indigo-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {sec.status === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : sec.status === 'active' ? (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                      )}
                      <span className="leading-snug line-clamp-2">{sec.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapsible Related Research Drawer */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => setIsRelatedOpen(!isRelatedOpen)}
                  className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-gray-900"
                >
                  <span>Related Papers ({relatedPapers.length})</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isRelatedOpen ? 'rotate-180' : ''}`} />
                </button>

                {isRelatedOpen && (
                  <div className="space-y-1.5 pt-1">
                    {relatedPapers.map((rel) => (
                      <div key={rel.title} className="p-2 rounded-lg bg-gray-50 hover:bg-indigo-50/50 transition-colors text-[11px] cursor-pointer">
                        <span className="font-semibold text-gray-800 block line-clamp-1">{rel.title}</span>
                        <span className="text-gray-400 font-mono text-[10px]">{rel.topic}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-[11px] text-gray-500 font-mono flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="font-bold text-gray-900">{readingProgress}%</span>
            </div>
          </aside>
        )}

        {/* CENTER PANE (60% HERO ACADEMIC READER - Zero Border Cards, Pure Notion/Apple Typography) */}
        <main className={`flex-1 bg-white overflow-y-auto ${isFocusMode ? 'px-6 sm:px-12 py-12 max-w-3xl mx-auto' : 'px-8 sm:px-16 py-12 max-w-4xl mx-auto'}`}>
          
          {/* Paper Title Header */}
          <div className="space-y-4 mb-12">
            <span className="badge-accent text-xs px-3 py-1">{activePaper.category}</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              {activePaper.title}
            </h1>
            <p className="text-sm font-mono text-gray-500 leading-relaxed">
              {activePaper.authors}
            </p>
            <div className="h-px bg-gray-200/80 w-full pt-4" />
          </div>

          {/* Academic Paper Sections Flow */}
          <div className="space-y-10 text-[19px] leading-[1.85] font-serif text-gray-800 select-text">
            {activePaper.sections.map((sec) => (
              <div key={sec.id} className="space-y-4">
                <h2 className="text-2xl font-bold font-sans text-gray-900 tracking-tight pt-4">
                  {sec.title}
                </h2>
                
                {/* Clean Paragraph Paragraph Flow */}
                {sec.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('Attention(')) {
                    return (
                      <div key={pIdx} className="p-5 my-6 bg-gray-50/80 border-l-4 border-indigo-600 rounded-r-2xl font-mono text-base text-indigo-950 shadow-xs">
                        {paragraph}
                      </div>
                    );
                  }
                  return (
                    <p key={pIdx} className="font-normal text-gray-800">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ))}
          </div>

          {/* PROACTIVE "NEXT RECOMMENDED STEP" PROMPT */}
          <div className="mt-16 pt-8 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Section 2 Completed! Next recommended action:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setReadingProgress(85)}
                className="p-4 bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-200/80 rounded-xl text-left transition-all text-xs font-semibold text-gray-900 group shadow-xs cursor-pointer"
              >
                <span className="block font-bold text-sm">1. Read Section 3 →</span>
                <span className="text-[11px] text-gray-500 group-hover:text-indigo-100 mt-1 block">Multi-Head Attention (18 min)</span>
              </button>

              <button
                onClick={() => setActiveDockPanel('quiz')}
                className="p-4 bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-200/80 rounded-xl text-left transition-all text-xs font-semibold text-gray-900 group shadow-xs cursor-pointer"
              >
                <span className="block font-bold text-sm">2. Take Quick Quiz →</span>
                <span className="text-[11px] text-gray-500 group-hover:text-indigo-100 mt-1 block">3 Active recall questions</span>
              </button>

              <button
                onClick={() => setActiveDockPanel('podcast')}
                className="p-4 bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-200/80 rounded-xl text-left transition-all text-xs font-semibold text-gray-900 group shadow-xs cursor-pointer"
              >
                <span className="block font-bold text-sm">3. Listen to Podcast →</span>
                <span className="text-[11px] text-gray-500 group-hover:text-indigo-100 mt-1 block">14-min Audio Summary</span>
              </button>
            </div>
          </div>

        </main>

        {/* RIGHT SIDEBAR (22% Width): COMPACT PROACTIVE PROFESSOR VOX MENTOR PANEL */}
        {!isFocusMode && (
          <aside className="w-[22%] min-w-[260px] max-w-[320px] bg-white border-l border-gray-200/80 flex flex-col shrink-0">
            
            {/* Mentor Header */}
            <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-700 flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xs">Professor Vox</h3>
                  <p className="text-[10px] text-indigo-100">Cognitive Twin Mentor</p>
                </div>
              </div>
              <span className="badge-accent text-[10px] px-2 py-0.5 bg-indigo-700 text-white border-indigo-500">Active</span>
            </div>

            {/* Proactive Action-Oriented Mentor Card */}
            <div className="p-4 bg-indigo-50/50 border-b border-gray-200/80 space-y-3 shrink-0">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Today's Goal</span>
                <h4 className="font-bold text-sm text-gray-900">Multi-Head Attention</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-indigo-600" />
                  <span>Est. Time: 18 min</span>
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => setReadingProgress(85)}
                  className="btn-primary w-full py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between shadow-xs cursor-pointer"
                >
                  <span>✓ Continue Reading</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => handleAIContextAction('Explain Concept')}
                  className="btn-secondary w-full py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <span>⚡ 5-Min Recap</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setActiveDockPanel('quiz')}
                  className="btn-secondary w-full py-2.5 text-xs font-semibold rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <span>🎯 Take Quick Quiz</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Q&A Assistant Chat */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50/30">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[90%] px-3.5 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-line break-words ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs font-medium shadow-xs'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.citation && (
                      <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                        <Sparkles className="w-3 h-3" />
                        <span>{msg.citation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium bg-white p-2.5 rounded-lg border border-gray-200/80 max-w-[180px]">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-gray-200 flex gap-2 shrink-0">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask Vox..."
                className="saas-input flex-1 text-xs py-1.5"
              />
              <button type="submit" disabled={!userQuery.trim() || isThinking} className="btn-primary text-xs px-3 py-1.5 font-semibold rounded-lg">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </aside>
        )}

      </div>

      {/* 3. STREAMLINED TWO-LAYER AI SELECTION CONTEXT TOOLBAR */}
      {menuPosition && (
        <div 
          style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
          className="fixed z-50 -translate-x-1/2 -translate-y-full bg-gray-900 text-white p-1.5 rounded-xl shadow-2xl flex items-center gap-1 animate-in fade-in zoom-in-95 duration-100 border border-gray-700"
        >
          <button
            onClick={() => handleAIContextAction('Explain Concept')}
            className="px-2.5 py-1 hover:bg-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" /> Explain
          </button>

          <button
            onClick={() => handleAIContextAction('Simplify Paragraph')}
            className="px-2.5 py-1 hover:bg-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3 h-3 text-blue-400" /> Simplify
          </button>

          <button
            onClick={() => handleAIContextAction('Visualize Diagram')}
            className="px-2.5 py-1 hover:bg-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <Layers className="w-3 h-3 text-indigo-400" /> Visualize
          </button>

          <button
            onClick={() => handleAIContextAction('Save Study Note')}
            className="px-2.5 py-1 hover:bg-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors text-emerald-400"
          >
            <FileText className="w-3 h-3" /> Save Note
          </button>

          <button
            onClick={() => setShowMoreActions(!showMoreActions)}
            className="px-2 py-1 hover:bg-gray-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors text-gray-300"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreActions && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-1.5 space-y-1">
              <button
                onClick={() => handleAIContextAction('Explain Mathematically')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-gray-800 rounded-lg text-xs font-medium text-emerald-300 block"
              >
                📐 Math Proof
              </button>
              <button
                onClick={() => handleAIContextAction('Show Code Example')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-gray-800 rounded-lg text-xs font-medium text-cyan-300 block"
              >
                💻 Code Implementation
              </button>
              <button
                onClick={() => handleAIContextAction('Generate Quiz')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-gray-800 rounded-lg text-xs font-medium text-rose-300 block"
              >
                🎯 Generate Quiz
              </button>
              <button
                onClick={() => handleAIContextAction('Convert to Podcast')}
                className="w-full text-left px-2.5 py-1.5 hover:bg-gray-800 rounded-lg text-xs font-medium text-purple-300 block"
              >
                🎧 Convert to Audio Podcast
              </button>
            </div>
          )}

        </div>
      )}

      {/* 4. BOTTOM DOCKABLE TOOL PANELS (VS CODE / FIGMA STYLE) */}
      {!isFocusMode && activeDockPanel && (
        <div className="bg-white border-t border-gray-200/80 shrink-0 shadow-lg z-20">
          
          {/* Dock Tabs Header */}
          <div className="px-5 h-10 bg-gray-50 flex items-center justify-between border-b border-gray-200/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveDockPanel(activeDockPanel === 'graph' ? null : 'graph')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeDockPanel === 'graph' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Knowledge Graph
              </button>

              <button
                onClick={() => setActiveDockPanel(activeDockPanel === 'podcast' ? null : 'podcast')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeDockPanel === 'podcast' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" /> AI Podcast Audio
              </button>

              <button
                onClick={() => setActiveDockPanel(activeDockPanel === 'quiz' ? null : 'quiz')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeDockPanel === 'quiz' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Active Quiz
              </button>

              <button
                onClick={() => setActiveDockPanel(activeDockPanel === 'notes' ? null : 'notes')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeDockPanel === 'notes' ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Study Notes
              </button>
            </div>

            <button onClick={() => setActiveDockPanel(null)} className="text-xs text-gray-400 hover:text-gray-600 font-medium">
              Close Panel ✕
            </button>
          </div>

          {/* Active Dock Panel Content */}
          <div className="p-5 h-48 overflow-y-auto bg-white">
            
            {activeDockPanel === 'graph' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">Workspace Prerequisite Concept DAG</h4>
                  <span className="badge-accent text-xs">3 Concepts Mastered • 1 Knowledge Gap</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Recurrent Neural Networks (RNN)
                    </span>
                    <p className="text-[11px] text-emerald-700">Mastered • 90% score</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Long Short-Term Memory (LSTM)
                    </span>
                    <p className="text-[11px] text-emerald-700">Mastered • 85% score</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                    <span className="font-bold text-rose-950 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cross-Attention Softmax Scaling
                    </span>
                    <p className="text-[11px] text-rose-700">Knowledge Gap Alert • 45% score</p>
                  </div>
                </div>
              </div>
            )}

            {activeDockPanel === 'podcast' && (
              <div className="space-y-3 max-w-xl mx-auto text-center py-1">
                <div className="flex items-center justify-center gap-3">
                  <button className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md">
                    <Play className="w-5 h-5 ml-0.5" />
                  </button>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-gray-900">Dual Co-Host Overview: Transformers Explained</h4>
                    <p className="text-xs text-gray-500">Co-Hosts Prabhat & Neerja • 14 min 30 sec</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            )}

            {activeDockPanel === 'quiz' && (
              <div className="space-y-3 max-w-2xl mx-auto">
                <span className="badge-warning text-[10px]">Active Recall</span>
                <h4 className="font-bold text-sm text-gray-900">Why does Self-Attention calculate Q, K, V dot-products in parallel?</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button className="p-2.5 rounded-lg border border-gray-200 hover:border-indigo-500 text-left bg-white font-medium">
                    A. To eliminate sequential RNN computation bottlenecks
                  </button>
                  <button className="p-2.5 rounded-lg border border-gray-200 hover:border-indigo-500 text-left bg-white font-medium">
                    B. To compress embedding dimensions by 50%
                  </button>
                </div>
              </div>
            )}

            {activeDockPanel === 'notes' && (
              <div className="space-y-2 max-w-3xl mx-auto">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-900">Workspace Research Notes</h4>
                  <span className="text-xs text-indigo-600 font-semibold cursor-pointer">Export PDF →</span>
                </div>
                <textarea
                  rows={3}
                  defaultValue={`# Self-Attention Notes\n- Formula: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V\n- Eliminates sequential computation bottlenecks.`}
                  className="saas-input w-full text-xs font-mono p-3 bg-gray-50"
                />
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
