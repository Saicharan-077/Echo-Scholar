import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Mic, 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Volume2,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

export const Podcasts: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [interruptionQuery, setInterruptionQuery] = useState('');
  const [interruptionAnswer, setInterruptionAnswer] = useState('');
  const [askingAI, setAskingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'audio' | 'transcript' | 'quiz'>('audio');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const demoScript = [
    { time: '0:05', speaker: 'Prabhat', text: "Welcome back to EchoScholar AI! Today we're breaking down Transformer Architecture and Self-Attention mechanisms." },
    { time: '0:24', speaker: 'Neerja', text: "That's right, Prabhat. Multi-Head Attention allows the model to jointly attend to information from different representation subspaces." },
    { time: '0:45', speaker: 'Prabhat', text: "Notice how matrix multiplication converts query and key vectors into attention weight matrices!" },
    { time: '1:10', speaker: 'Neerja', text: "Exactly. Without positional encoding, the Transformer would treat sequences as an unordered bag of words." },
  ];

  // Refs to decouple speech loop from React re-renders
  const isPlayingRef = useRef(false);
  const isInterruptedRef = useRef(false);
  const currentLineRef = useRef(0);

  // Sync refs with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isInterruptedRef.current = isInterrupted;
  }, [isInterrupted]);

  // Clean cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playLine = (index: number) => {
    if (!('speechSynthesis' in window)) return;
    if (!isPlayingRef.current || isInterruptedRef.current) return;

    const lineIdx = index % demoScript.length;
    currentLineRef.current = lineIdx;
    setCurrentLineIndex(lineIdx);

    const line = demoScript[lineIdx];
    const utterance = new SpeechSynthesisUtterance(line.text);

    // Differentiate co-host voice pitches
    if (line.speaker === 'Prabhat') {
      utterance.pitch = 0.95;
      utterance.rate = 1.0;
    } else {
      utterance.pitch = 1.25;
      utterance.rate = 1.05;
    }

    utterance.onend = () => {
      if (isPlayingRef.current && !isInterruptedRef.current) {
        const nextIdx = (lineIdx + 1) % demoScript.length;
        // Small delay between speakers
        setTimeout(() => {
          if (isPlayingRef.current && !isInterruptedRef.current) {
            playLine(nextIdx);
          }
        }, 500);
      }
    };

    utterance.onerror = (e) => {
      console.log('Speech synthesis note:', e);
      if (isPlayingRef.current && !isInterruptedRef.current) {
        const nextIdx = (lineIdx + 1) % demoScript.length;
        setTimeout(() => playLine(nextIdx), 600);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      window.speechSynthesis.cancel();
    } else {
      window.speechSynthesis.cancel();
      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsInterrupted(false);
      isInterruptedRef.current = false;
      // Start playing from current line
      setTimeout(() => playLine(currentLineRef.current), 100);
    }
  };

  const handleRestart = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    currentLineRef.current = 0;
    setCurrentLineIndex(0);
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsInterrupted(false);
    isInterruptedRef.current = false;
    setTimeout(() => playLine(0), 100);
  };

  const handleInterrupt = () => {
    if (!('speechSynthesis' in window)) return;
    isPlayingRef.current = false;
    isInterruptedRef.current = true;
    setIsPlaying(false);
    setIsInterrupted(true);
    window.speechSynthesis.cancel();
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
      const answer = res.data.answer || "Great question! Self-attention calculates how relevant every word in a sentence is to every other word, using Query, Key, and Value matrices.";
      setInterruptionAnswer(answer);

      // Speak AI Answer aloud cleanly
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const voxSpeech = new SpeechSynthesisUtterance(answer.replace(/[*#`]/g, '').slice(0, 280));
        voxSpeech.pitch = 1.0;
        window.speechSynthesis.speak(voxSpeech);
      }
    } catch (e) {
      const fallbackAns = "Self-attention allows the neural net to weigh the importance of different words in a sentence dynamically, regardless of their distance!";
      setInterruptionAnswer(fallbackAns);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const voxSpeech = new SpeechSynthesisUtterance(fallbackAns);
        window.speechSynthesis.speak(voxSpeech);
      }
    } finally {
      setAskingAI(false);
    }
  };

  const handleResumePodcast = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setInterruptionQuery('');
    setInterruptionAnswer('');
    setIsInterrupted(false);
    isInterruptedRef.current = false;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setTimeout(() => playLine(currentLineRef.current), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="saas-panel p-6 bg-white border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-2">
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
            <div className="w-16 h-16 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <span className="badge-accent">Paper Overview</span>
              <h2 className="h3-title text-lg mt-1 font-extrabold text-gray-900">Attention Is All You Need — Transformer Architecture</h2>
              <p className="small-text text-gray-500">Co-hosts: Prabhat (Deep Voice) & Neerja (Expressive)</p>
            </div>
          </div>

          {/* Equalizer Waveform Visualizer */}
          <div className="h-24 bg-gray-900 rounded-xl p-4 flex items-center justify-center gap-1 shadow-inner">
            {Array.from({ length: 48 }).map((_, i) => {
              const height = isPlaying 
                ? [25, 50, 85, 35, 95, 65, 45, 85, 100, 55, 75, 40][i % 12] 
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

          {/* Active Speaker Highlight Box */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>NOW SPEAKING: {demoScript[currentLineIndex].speaker}</span>
              <span className="text-[11px] font-mono text-indigo-500">{demoScript[currentLineIndex].time}</span>
            </div>
            <p className="text-sm font-medium text-gray-800 leading-relaxed">
              "{demoScript[currentLineIndex].text}"
            </p>
          </div>

          {/* Playback Controls & Interrupt Button */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4">
              <button
                onClick={handleTogglePlay}
                className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm transition-all cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Restart Podcast from Beginning"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <div>
                <p className="text-xs font-semibold text-gray-900">{isPlaying ? 'Playing Full Episode...' : 'Paused'}</p>
                <p className="text-[11px] text-gray-500 font-mono">Line {currentLineIndex + 1} of {demoScript.length} (Continuous Loop)</p>
              </div>
            </div>

            {/* THE KILLER HACKATHON FEATURE BUTTON */}
            <button
              onClick={handleInterrupt}
              className="btn-primary bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Mic className="w-4 h-4" />
              <span>Interrupt Co-Host</span>
            </button>
          </div>

        </div>

        {/* Right Interruption Assistant & Live Quiz Panel */}
        <div className="space-y-6">
          
          {/* Interruption Modal Box */}
          {isInterrupted ? (
            <div className="saas-card p-6 bg-amber-50 border-amber-200 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="badge-warning text-xs">Podcast Paused</span>
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 animate-pulse" /> Interruption Mode
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-sm text-gray-900">Ask Professor Vox Anything Mid-Episode:</h3>
                <input
                  type="text"
                  value={interruptionQuery}
                  onChange={(e) => setInterruptionQuery(e.target.value)}
                  placeholder="e.g., Why do we divide by sqrt(d_k)?"
                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl text-gray-900 outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleAskInterruption}
                disabled={askingAI}
                className="w-full btn-primary bg-amber-600 hover:bg-amber-700 text-white text-xs py-2 font-semibold rounded-xl cursor-pointer"
              >
                {askingAI ? 'Professor Vox Thinking & Speaking...' : 'Ask Question →'}
              </button>

              {interruptionAnswer && (
                <div className="p-3 bg-white border border-amber-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-amber-800">Professor Vox Answer:</p>
                  <p className="text-gray-800 leading-relaxed">{interruptionAnswer}</p>
                </div>
              )}

              <button
                onClick={handleResumePodcast}
                className="w-full text-center text-xs font-bold text-indigo-600 hover:underline pt-2 cursor-pointer"
              >
                ✓ Resume Podcast Episode →
              </button>
            </div>
          ) : (
            <div className="saas-card p-6 rounded-2xl space-y-4 bg-white border border-gray-200">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Live Interactive Features</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Click <strong>"Interrupt Co-Host"</strong> at any point to pause the episode, ask Professor Vox a technical question in real-time, and resume playback seamlessly!
              </p>
              <div className="p-3 bg-indigo-50 rounded-xl text-xs font-semibold text-indigo-900 border border-indigo-100">
                ⚡ Audio will continuously cycle through co-hosts Prabhat & Neerja and repeat automatically when the episode ends.
              </div>
            </div>
          )}

          {/* Active Recall Pop Quiz */}
          <div className="saas-card p-6 rounded-2xl space-y-4 bg-white border border-gray-200">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active Recall Pop Quiz</span>
            </div>

            <p className="text-xs text-gray-700 font-medium">
              Why does Multi-Head Attention use multiple attention heads instead of one?
            </p>

            <div className="space-y-2 text-xs">
              <button 
                onClick={() => alert("Correct! Multiple heads allow joint attention across different representation subspaces.")}
                className="w-full text-left p-2.5 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 font-medium transition-all cursor-pointer"
              >
                A. To attend to information from different representation subspaces
              </button>
              <button 
                onClick={() => alert("Incorrect. Try again!")}
                className="w-full text-left p-2.5 rounded-xl border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 font-medium transition-all cursor-pointer"
              >
                B. To decrease total parameter count
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
