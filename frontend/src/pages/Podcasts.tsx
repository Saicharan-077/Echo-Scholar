import React, { useState } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Mic, 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  RotateCcw,
  Volume2,
  Share2
} from 'lucide-react';
import { api } from '../services/api';

export const Podcasts: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [interruptionQuery, setInterruptionQuery] = useState('');
  const [interruptionAnswer, setInterruptionAnswer] = useState('');
  const [askingAI, setAskingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'audio' | 'transcript' | 'quiz'>('audio');

  const demoScript = [
    { time: '0:05', speaker: 'Prabhat', text: "Welcome back to EchoScholar AI! Today we're breaking down Transformer Architecture and Self-Attention mechanisms." },
    { time: '0:24', speaker: 'Neerja', text: "That's right, Prabhat. Multi-Head Attention allows the model to jointly attend to information from different representation subspaces." },
    { time: '0:45', speaker: 'Prabhat', text: "Notice how matrix multiplication converts query and key vectors into attention weight matrices!" },
    { time: '1:10', speaker: 'Neerja', text: "Exactly. Without positional encoding, the Transformer would treat sequences as unordered bag of words." },
  ];

  const handleInterrupt = () => {
    setIsPlaying(false);
    setIsInterrupted(true);
  };

  const handleAskInterruption = async () => {
    if (!interruptionQuery) return;
    setAskingAI(true);
    try {
      const res = await api.post('/chat/ask', {
        question: `I'm listening to the podcast about Transformers. ${interruptionQuery}`,
        ai_model: 'gemini-1.5-flash',
        agent_type: 'teacher'
      });
      setInterruptionAnswer(res.data.answer || "Great question! Self-attention calculates how relevant every word in a sentence is to every other word, using Query, Key, and Value matrices.");
    } catch (e) {
      setInterruptionAnswer("Self-attention allows the neural net to weigh the importance of different words in a sentence dynamically, regardless of their distance!");
    } finally {
      setAskingAI(false);
    }
  };

  const handleResumePodcast = () => {
    setIsInterrupted(false);
    setInterruptionQuery('');
    setInterruptionAnswer('');
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-purple-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NotebookLM Competitor Engine • Live Interruption Enabled</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">
            Dual Co-Host <span className="gradient-text">AI Podcast Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Featuring Prabhat & Neerja with real-time speech interruption and mid-podcast active recall.
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === 'audio' ? 'transcript' : 'audio')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all self-start md:self-auto"
        >
          {activeTab === 'audio' ? 'View Full Script Transcript' : 'Return to Audio Player'}
        </button>
      </div>

      {/* Main Player UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Player Panel */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 lg:p-8 space-y-6 border border-purple-500/20">
          
          {/* Cover & Title */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Headphones className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            <div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-500/30">
                Paper Overview
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Attention Is All You Need — Transformer Architecture
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Co-hosts: Prabhat (Deep Voice) & Neerja (Expressive)</p>
            </div>
          </div>

          {/* Animated Audio Waveform */}
          <div className="h-24 bg-slate-950/80 rounded-xl border border-slate-800 p-4 flex items-center justify-center gap-1">
            {Array.from({ length: 48 }).map((_, i) => {
              const height = isPlaying 
                ? [20, 45, 75, 30, 90, 60, 40, 80, 100, 50, 70, 35][i % 12] 
                : 15;
              return (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isPlaying 
                      ? 'bg-gradient-to-t from-purple-600 via-indigo-400 to-cyan-400' 
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Playback Controls & KILLER FEATURE: Interrupt Button */}
          <div className="flex items-center justify-between pt-2">
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <div>
                <p className="text-xs font-bold text-white">{isPlaying ? 'Playing Episode...' : 'Paused'}</p>
                <p className="text-[11px] text-slate-400">0:45 / 4:30 mins</p>
              </div>
            </div>

            {/* THE KILLER HACKATHON FEATURE BUTTON */}
            <button
              onClick={handleInterrupt}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Mic className="w-4 h-4" />
              <span>⚡ Hey Wait! Interrupt Co-Host</span>
            </button>

          </div>

          {/* Interruption Modal / Drawer */}
          {isInterrupted && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Podcast Paused • Ask Co-Hosts Prabhat & Neerja</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded">
                  Live Interruption Portal
                </span>
              </div>

              <div className="space-y-2">
                <textarea
                  value={interruptionQuery}
                  onChange={(e) => setInterruptionQuery(e.target.value)}
                  placeholder="e.g. Can you explain Query, Key, and Value matrices with a library book analogy?"
                  className="w-full bg-slate-900 border border-amber-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  rows={2}
                />
                
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleAskInterruption}
                    disabled={askingAI}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50"
                  >
                    {askingAI ? 'Asking Co-Hosts...' : 'Submit Clarification'}
                  </button>

                  <button
                    onClick={handleResumePodcast}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-all"
                  >
                    Resume Podcast ▶
                  </button>
                </div>
              </div>

              {interruptionAnswer && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1 text-xs">
                  <p className="font-bold text-amber-300">🎙️ Neerja (Co-Host Answer):</p>
                  <p className="text-slate-200 leading-relaxed">{interruptionAnswer}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar: Active Recall Quiz & Info */}
        <div className="space-y-6">
          
          {/* Active Recall Mid-Podcast Quiz */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-purple-500/20">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <HelpCircle className="w-5 h-5" />
              <span>In-Audio Pop Quiz</span>
            </div>

            <p className="text-xs text-slate-300">
              Why is Positional Encoding essential in Transformer Architecture?
            </p>

            <div className="space-y-2">
              {[
                'To inject token sequence order information',
                'To reduce matrix multiplication memory size',
                'To compress hidden layer dimensions',
                'To prevent gradient explosion in backprop'
              ].map((opt, i) => (
                <button
                  key={i}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 hover:border-purple-500/50 hover:text-white transition-all flex items-center gap-2"
                >
                  <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transcript Snippet */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Live Transcript Stream</span>
            </h3>

            <div className="space-y-3 text-xs max-h-48 overflow-y-auto pr-1">
              {demoScript.map((s, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-300">{s.speaker}</span>
                    <span className="text-[10px] text-slate-500">[{s.time}]</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
