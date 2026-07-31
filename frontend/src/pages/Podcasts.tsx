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
  Volume2
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
    { time: '0:05', speaker: 'Prabhat', text: "Welcome back to EchoXScholar AI! Today we're breaking down Transformer Architecture and Self-Attention mechanisms." },
    { time: '0:24', speaker: 'Neerja', text: "That's right, Prabhat. Multi-Head Attention allows the model to jointly attend to information from different representation subspaces." },
    { time: '0:45', speaker: 'Prabhat', text: "Notice how matrix multiplication converts query and key vectors into attention weight matrices!" },
    { time: '1:10', speaker: 'Neerja', text: "Exactly. Without positional encoding, the Transformer would treat sequences as an unordered bag of words." },
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
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>Dual Co-Host Engine • Real-Time Speech Portal</span>
          </div>
          <h1 className="h1-title text-2xl sm:text-3xl">Interactive Audio Podcasts</h1>
          <p className="small-text mt-1">
            Featuring Prabhat & Neerja with live mid-audio interruption and active recall pop quizzes.
          </p>
        </div>

        <button
          onClick={() => setActiveTab(activeTab === 'audio' ? 'transcript' : 'audio')}
          className="btn-secondary text-xs"
        >
          {activeTab === 'audio' ? 'View Transcript' : 'Return to Audio Player'}
        </button>
      </div>

      {/* Main Player UI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Player Panel */}
        <div className="lg:col-span-2 saas-card p-6 space-y-6">
          
          {/* Cover & Title */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <span className="badge-accent">Paper Overview</span>
              <h2 className="h3-title text-lg mt-1">Attention Is All You Need — Transformer Architecture</h2>
              <p className="small-text">Co-hosts: Prabhat (Deep Voice) & Neerja (Expressive)</p>
            </div>
          </div>

          {/* Equalizer Waveform Visualizer */}
          <div className="h-20 bg-gray-900 rounded-lg p-4 flex items-center justify-center gap-1">
            {Array.from({ length: 48 }).map((_, i) => {
              const height = isPlaying 
                ? [20, 45, 75, 30, 90, 60, 40, 80, 100, 50, 70, 35][i % 12] 
                : 15;
              return (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlaying ? 'bg-indigo-400' : 'bg-gray-700'
                  }`}
                />
              );
            })}
          </div>

          {/* Playback Controls & Interrupt Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div>
                <p className="text-xs font-semibold text-gray-900">{isPlaying ? 'Playing Episode...' : 'Paused'}</p>
                <p className="text-[11px] text-gray-500">0:45 / 4:30 mins</p>
              </div>
            </div>

            {/* THE KILLER HACKATHON FEATURE BUTTON */}
            <button
              onClick={handleInterrupt}
              className="btn-primary bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
            >
              <Mic className="w-4 h-4" />
              <span>⚡ Hey Wait! Interrupt Co-Host</span>
            </button>
          </div>

          {/* Interruption Drawer */}
          {isInterrupted && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900 text-xs">
                  🎙️ Podcast Paused • Ask Co-Hosts Prabhat & Neerja
                </span>
                <span className="badge-warning">Live Portal</span>
              </div>

              <textarea
                value={interruptionQuery}
                onChange={(e) => setInterruptionQuery(e.target.value)}
                placeholder="e.g. Can you explain Query, Key, and Value matrices with a library book analogy?"
                className="saas-input w-full text-xs"
                rows={2}
              />
              
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleAskInterruption}
                  disabled={askingAI}
                  className="btn-primary text-xs bg-amber-600 hover:bg-amber-700"
                >
                  {askingAI ? 'Asking AI...' : 'Submit Question'}
                </button>

                <button onClick={handleResumePodcast} className="btn-secondary text-xs">
                  Resume Podcast ▶
                </button>
              </div>

              {interruptionAnswer && (
                <div className="p-3 rounded bg-white border border-amber-200 space-y-1 text-xs text-gray-800">
                  <p className="font-bold text-amber-900">Neerja (Co-Host Answer):</p>
                  <p>{interruptionAnswer}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar: Pop Quiz & Transcript */}
        <div className="space-y-6">
          
          <div className="saas-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Active Recall Pop Quiz</span>
            </div>

            <p className="text-xs text-gray-700">
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
                  className="w-full text-left p-2 rounded border border-gray-200 text-xs text-gray-700 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center gap-2"
                >
                  <span className="font-bold text-gray-500">{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="saas-card p-5 space-y-3">
            <h3 className="h3-title text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Live Transcript Stream</span>
            </h3>

            <div className="space-y-3 text-xs max-h-48 overflow-y-auto pr-1">
              {demoScript.map((s, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{s.speaker}</span>
                    <span className="text-[10px] text-gray-400">[{s.time}]</span>
                  </div>
                  <p className="text-gray-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
