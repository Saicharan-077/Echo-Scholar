import React, { useState } from 'react';
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
  Compass
} from 'lucide-react';

interface ResearchWorkspaceProps {
  onOpenSearch?: () => void;
}

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({ onOpenSearch }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Active workspace state
  const [activePaperIndex, setActivePaperIndex] = useState(0);
  const [activeDockPanel, setActiveDockPanel] = useState<'graph' | 'podcast' | 'quiz' | 'notes' | null>('graph');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(72);

  // Floating AI Selection Context Menu state
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Professor Vox Assistant state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string; citation?: string }[]>([
    {
      role: 'assistant',
      text: `Welcome back, Manikanth! 👋\n\nBased on your previous sessions, you have mastered **RNNs & LSTMs**. Yesterday you completed **Section 3.1: Self-Attention Mechanics**.\n\n**Today's Focus**: Section 3.2 Multi-Head Attention & Scaled Dot-Product.\n⏱️ Estimated reading time: **18 minutes**.\n\nWould you like a 5-minute prerequisite recap or to resume reading?`
    }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Pre-seeded multi-paper workspace papers
  const papers = [
    {
      id: 'transformer-1',
      title: 'Attention Is All You Need',
      authors: 'Vaswani, Shazeer, Parmar, Uszkoreit et al.',
      category: 'Transformers & LLMs',
      sections: [
        { id: 'sec-1', status: 'completed', title: '1. Abstract & Introduction', content: 'Dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.' },
        { id: 'sec-2', status: 'active', title: '2. Model Architecture & Self-Attention', content: 'An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.\n\nAttention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V' },
        { id: 'sec-3', status: 'upcoming', title: '3. Multi-Head Attention & Positional Encoding', content: 'Instead of performing a single attention function with d_model-dimensional keys, values and queries, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively. Positional encodings are added to the input embeddings to inject sequence order.' }
      ]
    },
    {
      id: 'resnet-2',
      title: 'Deep Residual Learning for Image Recognition',
      authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
      category: 'Computer Vision',
      sections: [
        { id: 'sec-1', status: 'upcoming', title: '1. Abstract & Residual Learning', content: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those previously used. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.' }
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
        aiExplanation = `### 💡 Context-Aware Explanation\n\nBased on your background in RNNs, "${textToProcess}" means calculating how strongly each token in a sentence connects to every other token. Rather than reading word-by-word sequentially like an LSTM, the Transformer evaluates all token pairs simultaneously in parallel!`;
      } else if (actionLabel.includes('Visualize')) {
        aiExplanation = `### 📊 Visual Concept Diagram\n\n\`\`\`\nInput Tokens -> [ Query (Q) | Key (K) | Value (V) ]\n                     |\n             (Q * K^T) / sqrt(d_k)\n                     |\n                 Softmax Weights -> Output Matrix\n\`\`\``;
      } else if (actionLabel.includes('Math')) {
        aiExplanation = `### 📐 Mathematical Proof\n\n$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\nDividing by $\\sqrt{d_k}$ prevents dot products from growing excessively large in high dimensions, keeping softmax gradients stable.`;
      } else {
        aiExplanation = `Processed request for "${textToProcess}". Saved key takeaway to active study notes and updated Knowledge Graph node!`;
      }

      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', text: aiExplanation, citation: `📄 ${activePaper.title} • Section 2` }
      ]);
      setIsThinking(false);
    }, 700);
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
          text: `### 📄 Grounded Answer from ${activePaper.title}\n\nRegarding "${userText}": Based on what you've already read, self-attention computes global relationships between all words at once. Positional encodings are added to preserve sequence ordering since attention itself is permutation-invariant.`,
          citation: `📄 ${activePaper.title} • Section 2`
        }
      ]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col overflow-hidden fixed inset-0 z-50">
      
      {/* 1. IMMERSIVE TOP OS HEADER BAR (No standard navbar distraction) */}
      <header className="h-14 bg-gray-900 text-white px-6 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <Link to="/research" className="text-xs font-semibold text-indigo-300 hover:text-white transition-colors">
            ← My Research
          </Link>
          <span className="text-gray-600">/</span>
          <span className="badge-accent text-[11px] bg-indigo-900 text-indigo-200 border-indigo-700">Project Workspace</span>
          <h1 className="font-bold text-white text-sm line-clamp-1">Transformers & LLM Architecture Study</h1>
        </div>

        {/* Paper Tabs Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-gray-800 p-1 rounded-xl border border-gray-700">
          {papers.map((paper, idx) => (
            <button
              key={paper.id}
              onClick={() => setActivePaperIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activePaperIndex === idx ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-400 hover:text-white'
              }`}
            >
              {paper.title}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1 text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="font-semibold text-[10px] bg-gray-900 px-1.5 py-0.5 rounded border border-gray-700 text-gray-400">Cmd+K</kbd>
          </button>

          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Toggle Focus Mode"
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE STUDIO BODY */}
      <div className="flex-1 flex overflow-hidden relative" onMouseUp={handleTextSelection}>
        
        {/* LEFT SIDEBAR: LEARNING JOURNEY PROGRESS & RELATED PAPERS */}
        {!isFocusMode && (
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 hidden lg:flex">
            <div className="p-4 space-y-6 overflow-y-auto">
              
              {/* Learning Journey Progress Panel */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Learning Journey</p>
                  <span className="badge-accent text-[11px]">{readingProgress}%</span>
                </div>

                <div className="space-y-1.5">
                  {activePaper.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className={`p-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2.5 ${
                        sec.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200/80'
                          : sec.status === 'active'
                          ? 'bg-indigo-50 text-indigo-950 border-l-4 border-l-indigo-600 font-semibold'
                          : 'bg-gray-50 text-gray-600 border border-gray-100'
                      }`}
                    >
                      {sec.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : sec.status === 'active' ? (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                      )}
                      <span className="leading-snug">{sec.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Research Papers Exploration */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Related Research</span>
                </div>

                <div className="space-y-2">
                  {relatedPapers.map((rel) => (
                    <button
                      key={rel.title}
                      onClick={() => navigate('/workspace/transformer-1')}
                      className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-indigo-50/60 border border-gray-200/60 transition-all text-xs group"
                    >
                      <span className="font-semibold text-gray-800 group-hover:text-indigo-600 block line-clamp-1">{rel.title}</span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{rel.topic}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Total Mastered</span>
                <span>{readingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${readingProgress}%` }} />
              </div>
            </div>
          </aside>
        )}

        {/* CENTER PANE: ACADEMIC PDF & TEXT READER */}
        <main className="flex-1 bg-white overflow-y-auto p-8 lg:p-12 space-y-8 max-w-4xl mx-auto shadow-xs border-r border-gray-200">
          
          {/* Paper Title Header */}
          <div className="border-b border-gray-200 pb-6 space-y-3">
            <span className="badge-accent text-xs">{activePaper.category}</span>
            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">{activePaper.title}</h2>
            <p className="text-sm text-gray-500 font-mono">{activePaper.authors}</p>
          </div>

          {/* Paper Sections Content */}
          <div className="space-y-8 text-base text-gray-800 leading-relaxed font-serif select-text">
            {activePaper.sections.map((sec) => (
              <div key={sec.id} className="space-y-3">
                <h3 className="text-xl font-bold font-sans text-gray-900 border-l-4 border-indigo-600 pl-3">
                  {sec.title}
                </h3>
                <p className="whitespace-pre-line bg-gray-50/40 p-4 rounded-xl border border-gray-100">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* PROACTIVE "NEXT RECOMMENDED STEP" GUIDANCE CARD */}
          <div className="saas-panel p-6 bg-indigo-50/60 border-2 border-indigo-200/80 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>Section 2 Completed! What would you like to do next?</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => setReadingProgress(85)}
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-left transition-all text-xs font-semibold text-indigo-950 group shadow-xs cursor-pointer"
              >
                <span className="block font-bold">1. Read Section 3 →</span>
                <span className="text-[11px] text-gray-500 group-hover:text-indigo-100 mt-0.5 block">Multi-Head Attention (18 min)</span>
              </button>

              <button
                onClick={() => setActiveDockPanel('quiz')}
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-left transition-all text-xs font-semibold text-indigo-950 group shadow-xs cursor-pointer"
              >
                <span className="block font-bold">2. Take Quick Quiz →</span>
                <span className="text-[11px] text-gray-500 group-hover:text-indigo-100 mt-0.5 block">3 Active recall questions</span>
              </button>

              <button
                onClick={() => setActiveDockPanel('podcast')}
                className="p-3 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-left transition-all text-xs font-semibold text-indigo-950 group shadow-xs cursor-pointer"
              >
                <span className="block font-bold">3. Listen to Podcast →</span>
                <span className="text-[11px] text-gray-500 group-hover:text-indigo-100 mt-0.5 block">14-min Audio Overview</span>
              </button>
            </div>
          </div>

        </main>

        {/* RIGHT SIDEBAR: SIGNATURE PROFESSOR VOX AI COMPANION */}
        {!isFocusMode && (
          <aside className="w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-xs">
            
            {/* AI Header */}
            <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-800 flex items-center justify-center font-bold">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Professor Vox</h3>
                  <p className="text-[10px] text-indigo-200">Cognitive Twin AI Tutor</p>
                </div>
              </div>
              <span className="badge-accent text-[10px] px-2 py-0.5 bg-indigo-800 text-indigo-200 border-indigo-700">Active</span>
            </div>

            {/* Chat Conversation Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/40">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[88%] px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line break-words ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-xs font-medium'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-sm shadow-xs'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.citation && (
                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                        <Sparkles className="w-3 h-3" />
                        <span>{msg.citation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium bg-white p-3 rounded-xl border border-gray-200/80 max-w-[200px]">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask Professor Vox..."
                className="saas-input flex-1 text-xs py-2"
              />
              <button type="submit" disabled={!userQuery.trim() || isThinking} className="btn-primary text-xs px-4 py-2 font-semibold rounded-lg">
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
          {/* Layer 1 Primary Actions */}
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

          {/* Layer 2 More Actions Dropdown */}
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
      {!isFocusMode && (
        <div className="bg-white border-t border-gray-200 shrink-0 shadow-lg">
          
          {/* Dock Tabs Header */}
          <div className="px-6 h-11 bg-gray-50 flex items-center justify-between border-b border-gray-200">
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

            {activeDockPanel && (
              <button onClick={() => setActiveDockPanel(null)} className="text-xs text-gray-400 hover:text-gray-600">
                Collapse Dock ▼
              </button>
            )}
          </div>

          {/* Active Dock Panel Content */}
          {activeDockPanel && (
            <div className="p-6 h-56 overflow-y-auto bg-white">
              
              {activeDockPanel === 'graph' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900">Workspace Prerequisite Concept DAG</h4>
                    <span className="badge-accent text-xs">3 Concepts Mastered • 1 Knowledge Gap</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
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
                <div className="space-y-4 max-w-xl mx-auto text-center py-2">
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
                    rows={4}
                    defaultValue={`# Self-Attention Notes\n- Formula: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V\n- Eliminates sequential computation bottlenecks.`}
                    className="saas-input w-full text-xs font-mono p-3 bg-gray-50"
                  />
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
