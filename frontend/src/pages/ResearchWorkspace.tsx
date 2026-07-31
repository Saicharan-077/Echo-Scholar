import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PaperTabs } from '../features/workspace/components/PaperTabs';
import { LearningJourney } from '../features/workspace/components/LearningJourney';
import { VoxHeader } from '../features/vox/components/VoxHeader';
import { VoxGoalCard } from '../features/vox/components/VoxGoalCard';
import { Navbar } from '../components/Navbar';
import { InteractiveQuiz } from '../components/InteractiveQuiz';
import { Button } from '../shared/ui/Button';
import { Badge } from '../shared/ui/Badge';
import { Breadcrumbs } from '../shared/ui/Breadcrumbs';
import { WorkspaceToolbar } from '../shared/ui/WorkspaceToolbar';
import { ToolbarGroup } from '../shared/ui/ToolbarGroup';
import { ToolbarButton } from '../shared/ui/ToolbarButton';
import { FormattedChatMessage } from '../shared/ui/FormattedChatMessage';
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

  // 1. Dynamically load user uploaded papers from localStorage or fallback
  const savedUserPapers = (() => {
    const savedPapers = localStorage.getItem('echoscholar_user_papers');
    if (savedPapers) {
      try {
        const parsed = JSON.parse(savedPapers);
        return parsed.map((p: any) => ({
          id: p.id,
          title: p.title,
          authors: `Uploaded PDF: ${p.filename} • ${p.size || '1.5 MB'} • ${p.chunks || 36} Vector Chunks`,
          category: p.category || 'Uploaded Research Document',
          sections: (p.customSections && Array.isArray(p.customSections) && !p.customSections[0]?.content?.includes('FlateDecode') && !p.customSections[0]?.content?.includes('/Annots'))
            ? p.customSections
            : [
                {
                  id: 'sec-1',
                  status: 'completed',
                  title: `1. Executive Summary & Overview of ${p.title}`,
                  content: `This workspace section contains vectorized text content extracted from ${p.filename}.\n\nDocument Summary: ${p.summary || 'Uploaded document indexed into high-dimensional vector embeddings.'}\n\nThe document has been parsed into ${p.chunks || 36} vector chunks and synchronized with Professor Vox cognitive twin mentor and AI Learning Studio modes.`
                },
                {
                  id: 'sec-2',
                  status: 'active',
                  title: `2. Vector Chunk Extracts & Key Findings`,
                  content: `Extracted Key Concepts from ${p.title}:\n\n- Primary Domain: ${p.category || 'Artificial Intelligence'}\n- Structured Vector Embeddings: ${p.chunks || 36} chunks loaded in memory.\n- AI Learning Studio Integration: Ready for Socratic Active Recall, Audio Podcast Generation, and Knowledge Graph synthesis.`
                },
                {
                  id: 'sec-3',
                  status: 'upcoming',
                  title: `3. Interactive AI Learning Studio Synthesis`,
                  content: `Use the top toolbar options (Reader, Graph, Podcast, Quiz, Notes) or ask Professor Vox in the right sidebar to generate interactive learning experiences specifically tailored to ${p.title}.`
                }
              ]
        }));
      } catch (e) {}
    }
    return [];
  })();

  // 2. Default pre-seeded papers
  const defaultPapers = [
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

  // Combined papers list (uploaded papers first)
  const papers = [...savedUserPapers, ...defaultPapers];

  // Match paper by route id or session
  const matchedIndex = papers.findIndex((p: any) => {
    if (!id) return false;
    if (p.id === id) return true;
    const savedSessions = localStorage.getItem('echoscholar_learning_sessions');
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        const matchSession = sessions.find((s: any) => s.id === id);
        if (matchSession && matchSession.documentId === p.id) return true;
      } catch (e) {}
    }
    return false;
  });

  const activePaperIndex = matchedIndex >= 0 ? matchedIndex : 0;
  const activePaper = papers[activePaperIndex] || papers[0];

  // Active workspace state
  const [selectedPaperIdx, setSelectedPaperIdx] = useState(activePaperIndex);
  const [activeDockPanel, setActiveDockPanel] = useState<'graph' | 'podcast' | 'quiz' | 'notes' | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(72);
  const [isRelatedOpen, setIsRelatedOpen] = useState(false);

  // Floating AI Selection Context Menu state
  const [selectedText, setSelectedText] = useState('');
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Professor Vox Assistant state
  const [activeStepIndex, setActiveStepIndex] = useState(2);
  const [selectedRelatedPaper, setSelectedRelatedPaper] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string; citation?: string }[]>(() => [
    {
      role: 'assistant',
      text: `Welcome back, Manikanth!\n\nDocument Loaded: **${activePaper.title}**\n\nToday's Focus: **Section 2: Key Vector Chunk Extracts**.\nVector Indexing: **Active & Grounded**.`
    }
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

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
    <div className="h-screen w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex flex-col overflow-hidden">
      
      {/* REUSABLE WORKSPACE TOOLBAR & BREADCRUMBS */}
      <WorkspaceToolbar>
        <Breadcrumbs
          items={[
            { label: 'My Research', href: '/upload' },
            { label: activePaper.category, href: '/upload?tab=collections' },
            { label: activePaper.title }
          ]}
        />

        {/* Center Workspace Tool Selector Tabs (Linear/Vercel/Notion Standardized Primitives) */}
        <ToolbarGroup className="hidden md:flex">
          <ToolbarButton
            icon={<BookOpen className="w-4 h-4" />}
            label="Reader"
            isActive={!activeDockPanel}
            onClick={() => setActiveDockPanel(null)}
          />

          <ToolbarButton
            icon={<Layers className="w-4 h-4" />}
            label="Graph"
            isActive={activeDockPanel === 'graph'}
            onClick={() => setActiveDockPanel('graph')}
          />

          <ToolbarButton
            icon={<Headphones className="w-4 h-4" />}
            label="Podcast"
            isActive={activeDockPanel === 'podcast'}
            onClick={() => setActiveDockPanel('podcast')}
          />

          <ToolbarButton
            icon={<HelpCircle className="w-4 h-4" />}
            label="Quiz"
            isActive={activeDockPanel === 'quiz'}
            onClick={() => setActiveDockPanel('quiz')}
          />

          <ToolbarButton
            icon={<FileText className="w-4 h-4" />}
            label="Notes"
            isActive={activeDockPanel === 'notes'}
            onClick={() => setActiveDockPanel('notes')}
          />
        </ToolbarGroup>

        {/* Right Tools & Progress */}
        <div className="flex items-center gap-3">
          <Badge variant="accent">{readingProgress}% Complete</Badge>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSearch}
            className="flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <kbd className="font-mono text-[10px] text-gray-500">⌘K</kbd>
          </Button>

          <Button
            variant={isFocusMode ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="flex items-center gap-1.5"
            title="Focus Mode (ESC to exit)"
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFocusMode ? 'Exit Focus' : 'Focus'}</span>
          </Button>
        </div>
      </WorkspaceToolbar>

      {/* 2. MAIN THREE-PANE WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden relative" onMouseUp={handleTextSelection}>
        
        {/* LEFT SIDEBAR (18% Width): LEARNING JOURNEY & RELATED RESEARCH */}
        {!isFocusMode && (
          <aside className="w-[18%] min-w-[220px] max-w-[280px] bg-white border-r border-gray-200/80 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
            <div className="p-4 space-y-6 overflow-y-auto">
              
              {/* Learning Journey Stepper */}
              <LearningJourney
                sections={activePaper.sections.map((s, idx) => ({ id: idx + 1, title: s.title }))}
                activeStep={activeStepIndex}
                progress={readingProgress}
                onSelectStep={(stepId) => {
                  setActiveStepIndex(stepId);
                  const newProgress = Math.round((stepId / activePaper.sections.length) * 100);
                  setReadingProgress(newProgress);
                  const el = document.getElementById(`section-${stepId}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              />

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
                      <div
                        key={rel.title}
                        onClick={() => setSelectedRelatedPaper(rel)}
                        className="p-2.5 rounded-xl bg-gray-50 hover:bg-indigo-50/80 hover:border-indigo-200 border border-gray-200/50 transition-all text-[11px] cursor-pointer shadow-2xs group"
                      >
                        <span className="font-semibold text-gray-800 group-hover:text-indigo-900 block line-clamp-1">{rel.title}</span>
                        <span className="text-indigo-600 font-mono text-[10px]">{rel.topic}</span>
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

        {/* CENTER PANE (60% HERO ACADEMIC READER / FULL-SCREEN INTERACTIVE TOOL VIEW) */}
        <main className={`flex-1 bg-white overflow-y-auto ${isFocusMode ? 'px-6 sm:px-12 py-12 max-w-3xl mx-auto' : 'px-8 sm:px-12 py-8 max-w-5xl mx-auto'}`}>
          
          {/* A. FULL-SCREEN KNOWLEDGE GRAPH SCREEN */}
          {activeDockPanel === 'graph' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <button onClick={() => setActiveDockPanel(null)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-1 block">
                    ← Back to Paper Reader
                  </button>
                  <h2 className="text-2xl font-extrabold text-gray-900">Knowledge Graph & Prerequisite DAG</h2>
                  <p className="text-xs text-gray-500">Interactive concept dependency map for {activePaper.title}</p>
                </div>
                <Badge variant="accent" size="sm">3 Concepts Mastered • 1 Knowledge Gap</Badge>
              </div>

              <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Concept Mastery Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">1. Recurrent Neural Networks</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-gray-500">Prerequisite concept for sequential data processing.</p>
                    <span className="text-[11px] font-bold text-emerald-600 block">Mastery: 90%</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">2. Long Short-Term Memory</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-gray-500">Gated memory mechanics and vanishing gradient mitigation.</p>
                    <span className="text-[11px] font-bold text-emerald-600 block">Mastery: 85%</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">3. Softmax Scaling (d_k)</span>
                      <XCircle className="w-4 h-4 text-rose-600" />
                    </div>
                    <p className="text-xs text-gray-500">Dot-product scaling factor to prevent small gradient flow.</p>
                    <span className="text-[11px] font-bold text-rose-600 block">Knowledge Gap • 45%</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <Button variant="primary" size="sm" onClick={() => handleAIContextAction('Explain Softmax Scaling')}>
                    ⚡ Remediate Knowledge Gap with Prof. Vox
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* B. FULL-SCREEN AI PODCAST AUDIO STUDIO SCREEN */}
          {activeDockPanel === 'podcast' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <button onClick={() => setActiveDockPanel(null)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-1 block">
                    ← Back to Paper Reader
                  </button>
                  <h2 className="text-2xl font-extrabold text-gray-900">AI Podcast Studio</h2>
                  <p className="text-xs text-gray-500">Dual Co-Host Audio Overview: Transformers Explained</p>
                </div>
                <Badge variant="accent" size="sm">Co-Hosts Prabhat & Neerja</Badge>
              </div>

              <div className="p-8 bg-indigo-950 text-white rounded-2xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="w-14 h-14 bg-white text-indigo-950 rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-gray-100 transition-transform hover:scale-105 cursor-pointer">
                      <Play className="w-6 h-6 ml-1 text-indigo-950" />
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-white">Attention Is All You Need — Audio Breakdown</h3>
                      <p className="text-xs text-indigo-200">Episode 1 • 14 min 30 sec</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-indigo-900 px-3 py-1 rounded-full border border-indigo-700">1.0x Speed</span>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-indigo-900 rounded-full h-2 overflow-hidden border border-indigo-800">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: '35%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-indigo-300 font-mono">
                    <span>05:04</span>
                    <span>14:30</span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-900/60 rounded-xl space-y-2 border border-indigo-800">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Live Co-Host Transcript</span>
                  <p className="text-xs text-indigo-100 leading-relaxed italic">
                    "Welcome back to VoxScholar! Today we are dissecting the famous 2017 Transformer paper. Neerja, why did self-attention completely replace recurrent networks?"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* C. FULL-SCREEN SOCRATIC ACTIVE RECALL QUIZ SCREEN */}
          {activeDockPanel === 'quiz' && (
            <InteractiveQuiz 
              paperId={activePaper.id} 
              paperTitle={activePaper.title} 
              onBack={() => setActiveDockPanel(null)} 
            />
          )}

          {/* D. FULL-SCREEN WORKSPACE STUDY NOTES SCREEN */}
          {activeDockPanel === 'notes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <button onClick={() => setActiveDockPanel(null)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-1 block">
                    ← Back to Paper Reader
                  </button>
                  <h2 className="text-2xl font-extrabold text-gray-900">Workspace Study Notes</h2>
                  <p className="text-xs text-gray-500">Live markdown editor & AI note synthesis</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => alert('Exporting PDF notes...')}>
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </Button>
              </div>

              <div className="p-6 bg-white border border-gray-200/80 rounded-2xl space-y-4 shadow-xs">
                <textarea
                  rows={14}
                  defaultValue={`# Workspace Notes: Attention Is All You Need\n\n## 1. Key Takeaways\n- Eschews recurrent neural networks (RNN) and convolutions entirely.\n- Replaces sequential training with parallel matrix multiplication.\n\n## 2. Core Formula\n- Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V\n- d_k scaling factor prevents small gradients when vector dimensions grow large.\n\n## 3. Multi-Head Attention\n- Linearly projects Q, K, V h times to d_k, d_k, d_v dimensions.`}
                  className="w-full text-sm font-mono p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* E. DEFAULT: ACADEMIC PAPER READER VIEW */}
          {!activeDockPanel && (
            <>
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
                {activePaper.sections.map((sec, secIdx) => (
                  <div key={sec.id} id={`section-${secIdx + 1}`} className="space-y-4 scroll-mt-6">
                    <h2 className="text-2xl font-bold font-sans text-gray-900 tracking-tight pt-4">
                      {sec.title}
                    </h2>
                    
                    {/* Clean Paragraph Flow */}
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
                    <span className="block font-bold text-sm">1. Read Next Section →</span>
                    <span className="text-[11px] text-gray-500 group-hover:text-indigo-100 mt-1 block line-clamp-1">
                      {activePaper.sections?.[2]?.title || activePaper.sections?.[1]?.title || 'Section 2: Extracted Content'}
                    </span>
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
            </>
          )}

        </main>

        {/* RIGHT SIDEBAR (22% Width): COMPACT PROACTIVE PROFESSOR VOX MENTOR PANEL */}
        {!isFocusMode && (
          <aside className="w-[22%] min-w-[260px] max-w-[320px] bg-white border-l border-gray-200/80 flex flex-col shrink-0">
            
            {/* Mentor Header */}
            <VoxHeader status="Active" />

            {/* Proactive Action-Oriented Mentor Card */}
            <VoxGoalCard
              goalTitle="Multi-Head Attention"
              estTime="18 min"
              onContinueReading={() => setReadingProgress(85)}
              onRecap={() => handleAIContextAction('Explain Concept')}
              onQuiz={() => setActiveDockPanel('quiz')}
            />

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
                    <FormattedChatMessage text={msg.text} className={msg.role === 'user' ? 'text-white' : 'text-gray-800'} />
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



      {/* RELATED PAPER PREVIEW MODAL */}
      {selectedRelatedPaper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="badge-accent text-xs px-2.5 py-0.5">{selectedRelatedPaper.topic}</span>
              <button
                onClick={() => setSelectedRelatedPaper(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-lg text-gray-900 leading-snug">{selectedRelatedPaper.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Foundational research paper cited in the current Transformer architecture. Explores bidirectional context, pre-training objectives, and downstream transfer learning.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <span className="text-[11px] text-gray-500 font-mono">Citations: 45,210 • Published: 2019</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    handleAIContextAction(`Explain ${selectedRelatedPaper.title}`);
                    setSelectedRelatedPaper(null);
                  }}
                >
                  Ask Prof. Vox
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedRelatedPaper(null);
                    alert(`Loaded ${selectedRelatedPaper.title} into Workspace!`);
                  }}
                >
                  Open Paper →
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
