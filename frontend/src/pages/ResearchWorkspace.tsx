import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../services/api';
import { PaperTabs } from '../features/workspace/components/PaperTabs';
import { LearningJourney } from '../features/workspace/components/LearningJourney';
import { AILearningStudio } from '../features/workspace/components/AILearningStudio';
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
          db_id: p.db_id,
          title: p.title,
          authors: `Uploaded PDF: ${p.filename} • ${p.size || '1.5 MB'} • ${p.chunks || 36} Vector Chunks`,
          category: p.category || 'Uploaded Research Document',
          sections: (p.customSections && Array.isArray(p.customSections)
            && !p.customSections[0]?.content?.includes('FlateDecode')
            && !p.customSections[0]?.content?.includes('/Annots')
            && !p.customSections[0]?.content?.includes('StemV')
            && !p.customSections[0]?.content?.includes('ItalicAngle'))
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
      db_id: null,
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
      db_id: null,
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

  // Podcast state (real backend integration from remote)
  const [podcastUrl, setPodcastUrl] = useState<string | null>(null);
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [podcastStyle, setPodcastStyle] = useState('educational');

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
      text: `Hello! 👋\n\nYour workstation for **${activePaper.title}** is ready.\n\nToday's Focus: **Section 2**.\nStatus: **Active & Grounded**.\n\nAsk me anything or use the Quick Actions below!`
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

  // Auto-load existing podcast audio when panel opens
  useEffect(() => {
    if (activeDockPanel === 'podcast' && activePaper) {
      let pId = (activePaper as any).db_id;
      if (!pId) {
        const numId = parseInt(activePaper.id);
        pId = isNaN(numId) ? null : numId;
      }
      if (pId) {
        api.get(`/podcasts/paper/${pId}/audio`)
          .then(() => {
            setPodcastUrl(`http://localhost:8000/api/podcasts/paper/${pId}/audio`);
          })
          .catch(() => {
            // No pre-existing audio found — show generate prompt
          });
      }
    }
  }, [activeDockPanel, activePaper.id]);

  // Real podcast generation handler
  const handleGeneratePodcast = async () => {
    setPodcastLoading(true);
    setPodcastUrl(null);
    try {
      let pId = (activePaper as any).db_id;
      if (!pId) {
        const numId = parseInt(activePaper.id);
        pId = isNaN(numId) ? 1 : numId;
      }

      const res = await api.post(`/podcasts/generate`, {
        paper_id: pId,
        style: podcastStyle,
        voice_male: 'en-IN-PrabhatNeural',
        voice_female: 'en-IN-NeerjaNeural'
      });

      if (res.data.audio_url) {
        const path = res.data.audio_url.startsWith('/api') ? res.data.audio_url : `/api${res.data.audio_url}`;
        setPodcastUrl(`http://localhost:8000${path}`);
      } else {
        alert('Podcast generation failed or audio URL not provided.');
      }
    } catch (e: any) {
      alert('Error generating podcast: ' + (e.response?.data?.detail || e.message));
    } finally {
      setPodcastLoading(false);
    }
  };

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

  const streamAIResponse = async (promptText: string, actionContext?: string) => {
    const fullPrompt = actionContext ? `${actionContext}: "${promptText}"` : promptText;
    setIsThinking(true);

    setChatMessages(prev => [...prev, { role: 'user', text: fullPrompt }]);
    let currentMessageIndex = 0;

    setChatMessages(prev => {
      currentMessageIndex = prev.length;
      return [...prev, { role: 'assistant', text: '', citation: `📄 ${activePaper.title}` }];
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          paper_id: activePaper.id,
          message: fullPrompt,
        })
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = '';

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ') && line.trim() !== 'data: [DONE]') {
              const textChunk = line.replace('data: ', '');
              fullText += textChunk;
              setChatMessages(prev => {
                const updated = [...prev];
                if (updated[currentMessageIndex]) {
                  updated[currentMessageIndex] = { ...updated[currentMessageIndex], text: fullText };
                }
                return updated;
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setChatMessages(prev => {
        const updated = [...prev];
        if (updated[currentMessageIndex]) {
          updated[currentMessageIndex].text = 'Sorry, the AI Copilot encountered an error connecting to the stream.';
        }
        return updated;
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleAIContextAction = (actionLabel: string) => {
    const textToProcess = selectedText;
    setSelectedText('');
    setMenuPosition(null);
    streamAIResponse(textToProcess || actionLabel, textToProcess ? actionLabel : undefined);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const userText = userQuery.trim();
    setUserQuery('');
    streamAIResponse(userText);
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

        {/* Center Workspace Tool Selector Tabs */}
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
      <div className="flex-1 flex overflow-hidden relative bg-white" onMouseUp={handleTextSelection}>

        {/* LEFT SIDEBAR (~260px): LEARNING JOURNEY & RELATED RESEARCH */}
        {!isFocusMode && (
          <aside className="w-[260px] bg-gray-50/50 border-r border-gray-200/80 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
            <div className="p-5 space-y-6 overflow-y-auto">

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
              <div className="pt-5 border-t border-gray-200/60 space-y-3">
                <button
                  onClick={() => setIsRelatedOpen(!isRelatedOpen)}
                  className="w-full flex items-center justify-between text-[13px] font-bold text-gray-700 hover:text-gray-900"
                >
                  <span>Related Papers ({relatedPapers.length})</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isRelatedOpen ? 'rotate-180' : ''}`} />
                </button>

                {isRelatedOpen && (
                  <div className="space-y-2 pt-1">
                    {relatedPapers.map((rel) => (
                      <div
                        key={rel.title}
                        onClick={() => setSelectedRelatedPaper(rel)}
                        className="p-3 rounded-xl bg-white hover:bg-indigo-50/80 hover:border-indigo-200 border border-gray-200/60 transition-all text-xs cursor-pointer shadow-2xs group"
                      >
                        <span className="font-semibold text-gray-800 group-hover:text-indigo-900 block line-clamp-1">{rel.title}</span>
                        <span className="text-indigo-600 font-mono text-[10px] mt-0.5 block">{rel.topic}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <div className="p-4 border-t border-gray-200/60 bg-gray-50/80 text-xs text-gray-500 font-mono flex items-center justify-between">
              <span>Overall Progress</span>
              <span className="font-bold text-gray-900">{readingProgress}%</span>
            </div>
          </aside>
        )}

        {/* CENTER PANE (FLEX-1 HERO ACADEMIC READER / FULL-SCREEN INTERACTIVE TOOL VIEW) */}
        <main className="flex-1 bg-white overflow-y-auto relative scroll-smooth">
          <div className={`mx-auto ${isFocusMode ? 'max-w-3xl px-6 py-12' : 'max-w-[850px] px-8 sm:px-12 py-12'}`}>

            {/* A. FULL-SCREEN KNOWLEDGE GRAPH SCREEN */}
            {activeDockPanel === 'graph' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <button onClick={() => setActiveDockPanel(null)} className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 mb-1.5 block transition-colors">
                      ← Back to Reader
                    </button>
                    <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Knowledge Graph</h2>
                    <p className="text-sm text-gray-500 mt-1">Interactive concept dependency map for {activePaper.title}</p>
                  </div>
                  <Badge variant="accent" size="sm">3 Concepts Mastered • 1 Knowledge Gap</Badge>
                </div>

                <div className="p-8 bg-gray-50/50 rounded-2xl border border-gray-200/80 space-y-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Concept Mastery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">1. Recurrent Neural Networks</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-gray-500">Prerequisite concept for sequential data processing.</p>
                      <span className="text-xs font-bold text-emerald-600 block">Mastery: 90%</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">2. Long Short-Term Memory</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-gray-500">Gated memory mechanics and vanishing gradient mitigation.</p>
                      <span className="text-xs font-bold text-emerald-600 block">Mastery: 85%</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900">3. Softmax Scaling (d_k)</span>
                        <XCircle className="w-4 h-4 text-rose-600" />
                      </div>
                      <p className="text-xs text-gray-500">Dot-product scaling factor to prevent small gradient flow.</p>
                      <span className="text-xs font-bold text-rose-600 block">Knowledge Gap • 45%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200/60 flex justify-end">
                    <Button variant="primary" onClick={() => handleAIContextAction('Explain Softmax Scaling')}>
                      ⚡ Remediate Gap with Copilot
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
                    <button onClick={() => setActiveDockPanel(null)} className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 mb-1.5 block transition-colors">
                      ← Back to Reader
                    </button>
                    <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">AI Podcast Studio</h2>
                    <p className="text-sm text-gray-500 mt-1">Dual Co-Host Audio Overview — Prabhat & Neerja</p>
                  </div>
                  <Badge variant="accent" size="sm">Co-Hosts Prabhat & Neerja</Badge>
                </div>

                <div className="p-8 bg-indigo-950 text-white rounded-2xl space-y-6 shadow-xl">
                  {/* Style Selector & Generate Button */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="w-full">
                      <label className="text-xs text-indigo-300 font-bold mb-2 block">Select Podcast Style</label>
                      <div className="flex items-center gap-3 flex-wrap">
                        <select
                          value={podcastStyle}
                          onChange={(e) => setPodcastStyle(e.target.value)}
                          className="p-2 rounded-lg bg-indigo-900 border border-indigo-700 text-sm text-white focus:outline-none focus:border-amber-400 w-52"
                        >
                          <option value="educational">Educational (Default)</option>
                          <option value="casual">Casual & Fun</option>
                          <option value="debate">Debate / Critical</option>
                          <option value="deep-dive">Technical Deep Dive</option>
                        </select>
                        <button
                          onClick={handleGeneratePodcast}
                          disabled={podcastLoading}
                          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-indigo-950 font-bold text-sm transition-colors shadow-sm"
                        >
                          {podcastLoading ? 'Generating Audio...' : 'Generate New Podcast'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Podcast Player Area */}
                  {podcastLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 border-4 border-indigo-500 border-t-amber-400 rounded-full animate-spin"></div>
                      <p className="text-sm font-semibold text-indigo-200 animate-pulse text-center">
                        Prof. Vox is writing the script and recording audio.<br />
                        This requires compiling TTS and FFmpeg merging — usually 1–2 minutes...
                      </p>
                    </div>
                  ) : podcastUrl ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-indigo-950 rounded-full flex items-center justify-center font-bold shadow-lg shrink-0">
                          <Headphones className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{activePaper.title} — Audio Breakdown</h3>
                          <p className="text-xs text-indigo-200">Generated in {podcastStyle} style • Prabhat & Neerja</p>
                        </div>
                      </div>
                      <div className="w-full mt-4">
                        <audio controls className="w-full rounded-xl shadow-lg border border-indigo-700" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}>
                          <source src={podcastUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-indigo-300 border border-indigo-800 rounded-xl bg-indigo-900/50">
                      <Headphones className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Click "Generate New Podcast" to create an AI audio episode based on this document.</p>
                      <p className="text-xs mt-2 text-indigo-400">Powered by ElevenLabs / Edge TTS • Prabhat & Neerja voices</p>
                    </div>
                  )}
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
                    <button onClick={() => setActiveDockPanel(null)} className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 mb-1.5 block transition-colors">
                      ← Back to Reader
                    </button>
                    <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Workspace Study Notes</h2>
                    <p className="text-sm text-gray-500 mt-1">Live markdown editor & AI note synthesis</p>
                  </div>
                  <Button variant="primary" onClick={() => alert('Exporting PDF notes...')}>
                    <Download className="w-4 h-4 mr-2" />
                    <span>Export PDF</span>
                  </Button>
                </div>

                <div className="p-6 bg-white border border-gray-200/80 rounded-2xl shadow-xs">
                  <textarea
                    rows={14}
                    defaultValue={`# Workspace Notes: ${activePaper.title}\n\n## 1. Key Takeaways\n- Eschews recurrent neural networks (RNN) and convolutions entirely.\n- Replaces sequential training with parallel matrix multiplication.\n\n## 2. Core Formula\n- Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V\n- d_k scaling factor prevents small gradients when vector dimensions grow large.\n\n## 3. Multi-Head Attention\n- Linearly projects Q, K, V h times to d_k, d_k, d_v dimensions.`}
                    className="w-full text-[15px] font-mono p-4 bg-gray-50/50 border border-gray-200/80 rounded-xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 leading-relaxed transition-all resize-y"
                  />
                </div>
              </div>
            )}

            {/* E. DEFAULT: ACADEMIC PAPER READER VIEW */}
            {!activeDockPanel && (
              <div className="animate-fadeIn max-w-[75ch] mx-auto">
                {/* Paper Title Header */}
                <div className="space-y-5 mb-14">
                  <span className="badge-accent text-xs px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100">{activePaper.category}</span>
                  <h1 className="text-[40px] sm:text-[44px] font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                    {activePaper.title}
                  </h1>
                  <p className="text-[15px] font-mono text-gray-500 leading-relaxed">
                    {activePaper.authors}
                  </p>
                  <div className="h-px bg-gray-200/60 w-full pt-4" />
                </div>

                {/* Academic Paper Sections Flow — ReactMarkdown for rich rendering */}
                <div className="space-y-12 text-[17px] leading-[1.75] font-sans text-gray-700 select-text">
                  {activePaper.sections.map((sec, secIdx) => (
                    <div key={sec.id} id={`section-${secIdx + 1}`} className="space-y-5 scroll-mt-24">
                      <h2 className="text-[28px] sm:text-[32px] font-bold text-gray-900 tracking-tight leading-snug">
                        {sec.title}
                      </h2>

                      {/* ReactMarkdown with fallback to manual paragraph rendering */}
                      <div className="prose prose-indigo prose-lg max-w-none text-gray-800">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code: ({ node, className, children, ...props }: any) => {
                              const isInline = !className;
                              if (isInline) {
                                return (
                                  <code className="px-1.5 py-0.5 bg-indigo-50 text-indigo-800 rounded text-[0.9em] font-mono" {...props}>
                                    {children}
                                  </code>
                                );
                              }
                              return (
                                <div className="p-5 my-6 bg-gray-50/80 border-l-4 border-indigo-600 rounded-r-2xl font-mono text-[15px] text-indigo-950 shadow-xs overflow-x-auto">
                                  <code {...props}>{children}</code>
                                </div>
                              );
                            },
                            p: ({ children }: any) => (
                              <p className="leading-[1.8] tracking-tight mb-4">{children}</p>
                            )
                          }}
                        >
                          {sec.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PROACTIVE "NEXT RECOMMENDED STEP" PROMPT */}
                <div className="mt-20 pt-8 border-t border-gray-200/80 space-y-5">
                  <div className="flex items-center gap-2.5 text-gray-900 font-bold text-[15px]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Section 2 Completed! Next recommended action:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setReadingProgress(85)}
                      className="p-4 bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-200/60 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
                    >
                      <span className="block font-bold text-[15px]">1. Next Section →</span>
                      <span className="text-[13px] text-gray-500 group-hover:text-indigo-100 mt-1 block line-clamp-1">
                        {activePaper.sections?.[2]?.title || activePaper.sections?.[1]?.title || 'Section 2: Extracted Content'}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveDockPanel('quiz')}
                      className="p-4 bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-200/60 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
                    >
                      <span className="block font-bold text-[15px]">2. Take Quick Quiz →</span>
                      <span className="text-[13px] text-gray-500 group-hover:text-indigo-100 mt-1 block">3 Active recall questions</span>
                    </button>

                    <button
                      onClick={() => setActiveDockPanel('podcast')}
                      className="p-4 bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-200/60 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
                    >
                      <span className="block font-bold text-[15px]">3. Play Podcast →</span>
                      <span className="text-[13px] text-gray-500 group-hover:text-indigo-100 mt-1 block">AI Audio Summary</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* RIGHT SIDEBAR (~340px): AI LEARNING STUDIO COPILOT */}
        {!isFocusMode && (
          <aside className="w-[340px] bg-white border-l border-gray-200/80 flex flex-col shrink-0 relative z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
            <AILearningStudio
              paperTitle={activePaper.title}
              chatMessages={chatMessages}
              onSendMessage={(query) => {
                setUserQuery(query);
                setTimeout(() => {
                  streamAIResponse(query);
                }, 0);
              }}
              isThinking={isThinking}
              onActionClick={(action) => handleAIContextAction(action)}
            />
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
