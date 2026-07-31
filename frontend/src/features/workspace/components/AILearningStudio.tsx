import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  Send, 
  BrainCircuit, 
  BookOpen, 
  Headphones, 
  Map, 
  Zap, 
  Settings2,
  ChevronDown,
  Square,
  Activity
} from 'lucide-react';
import { FormattedChatMessage } from '../../../shared/ui/FormattedChatMessage';

interface AILearningStudioProps {
  paperTitle: string;
  chatMessages: { role: 'user' | 'assistant'; text: string; citation?: string }[];
  onSendMessage: (query: string) => void;
  isThinking: boolean;
  onActionClick: (action: string) => void;
}

const LEARNING_MODES = [
  { id: 'learning', label: 'Learning Mode', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { id: 'debate', label: 'Debate Mode', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'teacher', label: 'Teacher Mode', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
];

export const AILearningStudio: React.FC<AILearningStudioProps> = ({
  paperTitle,
  chatMessages,
  onSendMessage,
  isThinking,
  onActionClick
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [activeMode, setActiveMode] = useState(LEARNING_MODES[0]);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Web Speech API State
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  useEffect(() => {
    // Initialize Speech Recognition if supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setUserQuery(prev => (prev + ' ' + finalTranscript).trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        stopRecording();
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopRecording();
    };
  }, []);

  const startAudioAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);

      const updateLevel = () => {
        if (!analyzerRef.current) return;
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        // Normalize to 0-100 range roughly
        const level = Math.min(100, Math.round((average / 128) * 100));
        setAudioLevel(level);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.error("Microphone permission denied or not supported.", err);
    }
  };

  const stopAudioAnalyzer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
      startAudioAnalyzer();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();
    stopAudioAnalyzer();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) stopRecording();
    if (userQuery.trim()) {
      onSendMessage(userQuery);
      setUserQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      
      {/* Studio Header (Mode Selector & Focus) */}
      <div className="p-4 border-b border-gray-100 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Copilot</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsModeSelectorOpen(!isModeSelectorOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-colors"
            >
              {activeMode.icon}
              <span>{activeMode.label}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            
            {isModeSelectorOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                {LEARNING_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => { setActiveMode(mode); setIsModeSelectorOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${activeMode.id === mode.id ? 'text-indigo-600' : 'text-gray-700'}`}
                  >
                    {mode.icon}
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 px-1">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onActionClick('Generate Quiz')} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-xs transition-all group text-left">
            <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100">
              <Zap className="w-3 h-3 text-indigo-600" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 group-hover:text-indigo-900 leading-tight">Generate<br/>Quiz</span>
          </button>
          
          <button onClick={() => onActionClick('Generate Flashcards')} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-xs transition-all group text-left">
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100">
              <BookOpen className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 group-hover:text-blue-900 leading-tight">Create<br/>Flashcards</span>
          </button>

          <button onClick={() => onActionClick('Generate Podcast')} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-xs transition-all group text-left">
            <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100">
              <Headphones className="w-3 h-3 text-purple-600" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 group-hover:text-purple-900 leading-tight">Audio<br/>Podcast</span>
          </button>

          <button onClick={() => onActionClick('Generate Mind Map')} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-xs transition-all group text-left">
            <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100">
              <Map className="w-3 h-3 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-gray-700 group-hover:text-emerald-900 leading-tight">Mind<br/>Map</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-gradient-to-b from-transparent to-gray-50/30">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col w-full animate-fadeIn ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[90%] px-4 py-3 rounded-2xl text-[13px] leading-[1.6] shadow-xs break-words ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm font-medium'
                  : 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-sm'
              }`}
            >
              <FormattedChatMessage text={msg.text} className={msg.role === 'user' ? 'text-white' : 'text-gray-800'} />
              {msg.citation && (
                <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                  <BookOpen className="w-3 h-3" />
                  <span>{msg.citation}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium bg-white px-4 py-3 rounded-2xl border border-gray-200/80 shadow-xs max-w-[160px] rounded-tl-sm animate-pulse">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="ml-2">Copilot is thinking...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input & Voice Interface */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        
        {/* Active Recording State */}
        {isRecording && (
          <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-rose-700">Listening...</span>
            </div>
            
            {/* Live Audio Waveform */}
            <div className="flex items-center gap-0.5 h-4">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-rose-400 rounded-full transition-all duration-75"
                  style={{ 
                    height: `${Math.max(20, Math.min(100, audioLevel * (Math.random() * 0.5 + 0.5)))}%` 
                  }}
                />
              ))}
            </div>
            
            <button onClick={stopRecording} type="button" className="text-rose-600 hover:text-rose-800 p-1">
              <Square className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="relative flex items-end gap-2 bg-gray-50 focus-within:bg-white border border-gray-200 focus-within:border-indigo-300 focus-within:shadow-xs focus-within:ring-4 focus-within:ring-indigo-50 rounded-2xl p-1.5 transition-all">
          
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
            placeholder={isRecording ? "Speak now..." : "Ask Copilot anything..."}
            className="flex-1 max-h-32 min-h-[40px] text-[13px] py-2.5 px-3 bg-transparent outline-none resize-none placeholder:text-gray-400 leading-relaxed font-medium"
            rows={1}
          />

          <div className="flex items-center gap-1.5 p-1 shrink-0">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-all flex items-center justify-center shadow-xs ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            
            <button
              type="submit"
              disabled={!userQuery.trim() || isThinking}
              className="p-2 rounded-xl transition-all flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">Copilot uses {activeMode.label}</p>
      </div>

    </div>
  );
};
